const _ = require('lodash');
const pluginInfo = require('../../package.json').eggPlugin;
const CONTROLLER_NAME=pluginInfo.controller;

const AdminController = require('../controller/manage/'+CONTROLLER_NAME)
const ApiController = require('../controller/api/'+CONTROLLER_NAME)

module.exports = (options, app) => {

    return async function router(ctx, next) {

        let pluginConfig = app.config.configPlugin;
        await app.initPluginRouter(ctx, pluginConfig, AdminController, ApiController);
        await next();

    }

}