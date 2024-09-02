"use strict";

module.exports = ({ strapi }) => ({
  async find(query) {
    return await strapi.entityService.findMany("plugin::my-strapi-plugin.todo", query);
  },

  async delete(id) {
    return await strapi.entityService.delete("plugin::my-strapi-plugin.todo", id);
  },

  async create(data) {
    return await strapi.entityService.create("plugin::my-strapi-plugin.todo", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::my-strapi-plugin.todo", id, data);
  },

  async toggle(id) {
    const result = await strapi.entityService.findOne("plugin::my-strapi-plugin.todo", id);
    return await strapi.entityService.update("plugin::my-strapi-plugin.todo", id, {
      data: { isDone: !result.isDone },
    });
  },
});



