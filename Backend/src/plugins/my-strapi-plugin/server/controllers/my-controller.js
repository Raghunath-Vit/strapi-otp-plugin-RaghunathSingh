
'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('my-strapi-plugin')
      .service('myService')
      .getWelcomeMessage();
  },
};



