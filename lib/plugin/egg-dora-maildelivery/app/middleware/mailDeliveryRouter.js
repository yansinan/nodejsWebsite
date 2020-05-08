const _ = require('lodash');
const mailDeliveryAdminController = require('../controller/manage/mailDelivery')

module.exports = (options, app) => {

    return async function mailDeliveryRouter(ctx, next) {

        let pluginConfig = app.config.doraMailDelivery;
        await app.initPluginRouter(ctx, pluginConfig, mailDeliveryAdminController);
        await next();

    }

}