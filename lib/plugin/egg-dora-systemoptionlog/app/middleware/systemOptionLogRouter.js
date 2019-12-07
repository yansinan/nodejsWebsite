const _ = require('lodash');
const systemOptionLogManageController = require('../controller/manage/systemOptionLog')

module.exports = (options, app) => {

    return async function systemOptionLogRouter(ctx, next) {

        let pluginConfig = app.config.doraSystemOptionLog;
        await app.initPluginRouter(ctx, pluginConfig, systemOptionLogManageController);
        await next();

    }

}