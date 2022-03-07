/*
 * @Author: doramart 
 * @Date: 2019-11-02 18:38:55 
 * @Discription 404 filter
 * @Last Modified by: dr
 * @Last Modified time: 2022-03-08 01:43:23
 */
const _ = require('lodash')
module.exports = () => {
    return async function notFoundHandler(ctx, next) {
        await next();
        if (ctx.status === 404 && !ctx.body) {
            if (ctx.acceptJSON) {
                ctx.body = {
                    error: 'Not Found'
                };
            } else {
                if (ctx.originalUrl.indexOf('/admin/') == 0) {
                    ctx.redirect('/dr-admin');
                } else if(ctx.originalUrl.indexOf('/sockjs-node/') ==0){
                    ctx.body = '<h1>sockjs-node</h1>';
                }else {
                    try {
                        // console.warn("NOT FOUND from ",ctx.ip,",url:",ctx.url,"header:",ctx.header)
                        ctx.logger.warn("NOT FOUND from ",ctx.ip,"\n url:",ctx.url,"\n request:",ctx.request,"\n query:",ctx.query,"\n header:",ctx.header,)
                        ctx.redirect('/404');
                        return;
                        let defaultTemp = await ctx.helper.reqJsonData('contentTemplate/getDefaultTempInfo');
                        let configs = await ctx.helper.reqJsonData('systemConfig/getConfig');
                        if (!_.isEmpty(defaultTemp) && !_.isEmpty(configs)) {
                            await ctx.render(`${defaultTemp.alias}/404`, {
                                domain: configs.siteDomain,
                                siteName: configs.siteName
                            });
                        } else {
                            ctx.body = '<h1>Page Not Found</h1>';
                        }
                    } catch (error) {
                        ctx.body = '<h1>Page Not Found</h1>';
                    }
                }

            }
        }
    };
};