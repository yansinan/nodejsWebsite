const _ = require('lodash');
const contentAdminController = require('../controller/manage/content')
const contentApiController = require('../controller/api/content')

module.exports = (options, app) => {

    return async function contentRouter(ctx, next) {

        let pluginConfig = app.config.doraContent;
        await app.initPluginRouter(ctx, pluginConfig, contentAdminController, contentApiController);
        await next();

    }

}