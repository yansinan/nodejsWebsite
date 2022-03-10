/*
 * @Author: doramart 
 * @Date: 2019-11-02 18:38:55 
 * @Discription 404 filter
 * @Last Modified by: dr
 * @Last Modified time: 2022-03-10 17:43:01
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
                } else if(ctx.url.indexOf('/static/') ==0){
                    // 访问静态文件
                    ctx.body = '<h1>Static Resource Not Found</h1>';
                    ctx.logger.warn("NOT FOUND 静态文件:",ctx.url,"\n request:",ctx.request,);
                }else {
                    try {
                        // console.warn("NOT FOUND from ",ctx.ip,",url:",ctx.url,"header:",ctx.header)
                        ctx.logger.warn("NOT FOUND type:",ctx.request.type,"\n request:",ctx.request,);
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