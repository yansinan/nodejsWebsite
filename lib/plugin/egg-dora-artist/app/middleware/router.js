const _ = require('lodash');
const artistAdminController = require('../controller/manage/artist')
const artistApiController = require('../controller/api/artist')

module.exports = (options, app) => {

    return async function router(ctx, next) {

        let pluginConfig = app.config.doraArtist;
        await app.initPluginRouter(ctx, pluginConfig, artistAdminController, artistApiController);
        await next();

    }

}