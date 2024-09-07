'use strict';

const crypto = require('crypto');
const { createTwilioMessage } = require('../../twilioClient.js');
const twilio = require('twilio');
const https = require('https');
const { twilio: twilioConfig } = require('../config/index.js'); 
const { ValidationError } = require('@strapi/utils').errors;

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
const agent = new https.Agent({ rejectUnauthorized: false });

module.exports = {
  async generateAndCreateOtp(ctx) {
    console.log('Request body:', ctx.request.body);
    const { phoneNumber } = ctx.request.body;

    try {
      await strapi.db.query('plugin::otp-plugin.otplogin').updateMany({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: { $gte: new Date() },
        },
        data: { isUsed: true },
      });

      const otpCode = crypto.randomInt(100000, 999999).toString();
      console.log(`Generated OTP: ${otpCode}`);
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const otpRecord = await strapi.db.query('plugin::otp-plugin.otplogin').create({
        data: {
          phoneNumber,
          otpCode,
          isUsed: false,
          expiresAt,
        },
      });

      const message = await createTwilioMessage({
        body: `Your OTP is ${otpCode}. It is valid for 5 minutes.`,
        from: twilioConfig.phoneNumber,
        to: phoneNumber,  
      });

      console.log(`Message SID: ${message.sid}`);
      return otpRecord;
    } catch (error) {
      console.error('Error generating or sending OTP:', error);
    }
  },

  async validateOtp(ctx) {
    const { phoneNumber, otpCode } = ctx.request.body;
  
    try {
      // it is used to fetch the OTP record that matches the phone number, OTP code, and is not used yet
      const otpRecord = await strapi.db.query('plugin::otp-plugin.otplogin').findOne({
        where: {
          phoneNumber,
          otpCode,
          isUsed: false,
          expiresAt: { $gte: new Date() }, 
        },
      });
  
      if (!otpRecord) {
        // OTP is either invalid or expired
        ctx.badRequest('Invalid OTP or OTP expired');
        return;
      }
  
      // OTP is valid; now mark it as used
      await strapi.db.query('plugin::otp-plugin.otplogin').update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });
  
      const username = phoneNumber;
      const email = `${phoneNumber.slice(1)}@gmail.com`;
  
      // Here i am checking if the user already exists
      let existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { $or: [{ username }, { email }] },
      });
  
      if (!existingUser) {
        // if user not there then a new user is created
        console.log('Creating new user');
        existingUser = await strapi.db.query('plugin::users-permissions.user').create({
          data: {
            username,
            email,
            password: phoneNumber, //strapi already hides the password so i don't need to hash it.
            role: 2, // after seeing the strapi required field my role is neccesary where i need to pass the id of the role so for the public role and use the permission given to public. By looking in postman my Public role is at id 2
          },
        });
  
        console.log('New user created:', existingUser);
      } else {
        console.log('User already exists:', existingUser);
      }
      // ctx.body = { status: true, message: 'OTP validated successfully, user created or exists' };
      ctx.body = { isValid: true, message: 'OTP validated successfully, user created or exists' };
    } catch (error) {
      console.error('Error validating OTP:', error);
      ctx.badRequest('Failed to validate OTP', { error });
      ctx.body = { isValid: false, message: 'Failed to validate OTP' };
    }
  },
  

  async find(ctx) {
    try {
      const query = ctx.query;
      const records = await strapi.db.query('plugin::otp-plugin.otplogin').findMany({ where: query });
      ctx.body = records;
    } catch (error) {
      console.error('Error finding OTP records:', error);
      // ctx.badRequest('Failed to find OTP records', { error });
    }
  },
  
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const record = await strapi.db.query('plugin::otp-plugin.otplogin').findOne({ where: { id } });
      ctx.body = record;
    } catch (error) {
      console.error('Error finding OTP record:', error);
      // ctx.badRequest('Failed to find OTP record', { error });
    }
  },

  async create(ctx) {
    try {
      const data = ctx.request.body;
      const record = await strapi.db.query('plugin::otp-plugin.otplogin').create({ data });
      ctx.body = record;
    } catch (error) {
      console.error('Error creating OTP record:', error);
      // ctx.badRequest('Failed to create OTP record', { error });.
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      const updatedRecord = await strapi.db.query('plugin::otp-plugin.otplogin').update({ where: { id }, data });
      ctx.body = updatedRecord;
    } catch (error) {
      console.error('Error updating OTP record:', error);
      // ctx.badRequest('Failed to update OTP record', { error });
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const deletedRecord = await strapi.db.query('plugin::otp-plugin.otplogin').delete({ where: { id } });
      ctx.body = deletedRecord;
    } catch (error) {
      console.error('Error deleting OTP record:', error);
      // ctx.badRequest('Failed to delete OTP record', { error });
    }
  }
};
