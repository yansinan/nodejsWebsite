/*
 * @Author: doramart 
 * @Date: 2019-09-23 14:44:21 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-05-02 11:15:54
 */

const _ = require('lodash');


let ContentTemplateController = {

    async getDefaultTempInfo(ctx, app) {

        let defaultTempData = app.cache.get(app.config.session_secret + '_default_temp');
        if (!_.isEmpty(defaultTempData)) {
            console.log('get cache template')
            ctx.helper.renderSuccess(ctx, {
                data: defaultTempData
            });
        } else {
            let defaultTemp = await ctx.service.contentTemplate.item(ctx, {
                query: {
                    'using': true
                },
                populate: ['items']
            })
            if (!_.isEmpty(defaultTemp)) {
                // 缓存1天
                ctx.helper.setMemoryCache(app.config.session_secret + '_default_temp', defaultTemp, 1000 * 60 * 60 * 24);
                ctx.helper.renderSuccess(ctx, {
                    data: defaultTemp
                });
            } else {
                ctx.helper.renderSuccess(ctx, {
                    data: {}
                });
            }
        }

    }


}

module.exports = ContentTemplateController;