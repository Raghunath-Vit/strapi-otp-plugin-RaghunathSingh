// const { v4: uuidv4 } = require('uuid');
// const crypto = require('crypto');

// module.exports = {
//   async generateAndCreateOtp(phoneNumber) {
    
//     await strapi.db.query('plugin::otp-plugin.otplogin').updateMany({
//       where: {
//         phoneNumber,
//         isUsed: false,
//         expiresAt: { $gte: new Date() },
//       },
//       data: { isUsed: true },
//     });

    
//     const otpCode = crypto.randomInt(100000, 999999).toString();

//     const expiresAt = new Date();
//     expiresAt.setMinutes(expiresAt.getMinutes() + 1);

    
//     return strapi.db.query('plugin::otp-plugin.otplogin').create({
//       data: {
//         phoneNumber,
//         otpCode,
//         isUsed: false,
//         expiresAt,
//       },
//     });
//   },

//   async validateOtp(phoneNumber, otpCode) {
//     const otpRecord = await strapi.db.query('plugin::otp-plugin.otplogin').findOne({
//       where: {
//         phoneNumber,
//         otpCode,
//         isUsed: false,
//         expiresAt: { $gte: new Date() },
//       },
//     });

//     if (otpRecord) {
//       await strapi.db.query('plugin::otp-plugin.otplogin').update({
//         where: { id: otpRecord.id },
//         data: { isUsed: true },
//       });
//       return true;
//     }
//     return false;
//   },

//   async find(query) {
//     return strapi.db.query('plugin::otp-plugin.otplogin').findMany({ where: query });
//   },

//   async findOne(id) {
//     return strapi.db.query('plugin::otp-plugin.otplogin').findOne({ where: { id } });
//   },

//   async create(data) {
//     return strapi.db.query('plugin::otp-plugin.otplogin').create({ data });
//   },

//   async update(id, data) {
//     return strapi.db.query('plugin::otp-plugin.otplogin').update({ where: { id }, data });
//   },

//   async delete(id) {
//     return strapi.db.query('plugin::otp-plugin.otplogin').delete({ where: { id } });
//   }
// };











// Below one sending OTP to phone and above one is OTP to console




// fresh 
const crypto = require('crypto');
const { createTwilioMessage } = require('../../twilioClient.js');
const twilio = require('twilio');
const https = require('https');
const { twilio: twilioConfig } = require('../config/index.js'); 

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

const agent = new https.Agent({ rejectUnauthorized: false });

module.exports = {
  async generateAndCreateOtp(phoneNumber) {
    await strapi.db.query('plugin::otp-plugin.otplogin').updateMany({
      where: {
        phoneNumber,
        isUsed: false,
        expiresAt: { $gte: new Date() },
      },
      data: { isUsed: true },
    });

    try {
      const otpCode = crypto.randomInt(100000, 999999).toString();
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
      console.log(`${message}`);

      return otpRecord;
    } catch (error) {
      console.error('Error generating or sending OTP:', error);
      throw new Error('Failed to generate or send OTP');
    }
  },

  async validateOtp(phoneNumber, otpCode) {
    try {
      const otpRecord = await strapi.db.query('plugin::otp-plugin.otplogin').findOne({
        where: {
          phoneNumber,
          otpCode,
          isUsed: false,
          expiresAt: { $gte: new Date() },
        },
      });

      if (otpRecord) {
        await strapi.db.query('plugin::otp-plugin.otplogin').update({
          where: { id: otpRecord.id },
          data: { isUsed: true },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validating OTP:', error);
      return false;
    }
  },

  async find(query) {
    return strapi.db.query('plugin::otp-plugin.otplogin').findMany({ where: query });
  },
  async findOne(id) {
    return strapi.db.query('plugin::otp-plugin.otplogin').findOne({ where: { id } });
  },

  async create(data) {
    return strapi.db.query('plugin::otp-plugin.otplogin').create({ data });
  },

  async update(id, data) {
    return strapi.db.query('plugin::otp-plugin.otplogin').update({ where: { id }, data });
  },

  async delete(id) {
    return strapi.db.query('plugin::otp-plugin.otplogin').delete({ where: { id } });
  }
};
