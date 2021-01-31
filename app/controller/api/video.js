/*
 * @Author: dr 
 * @Date: 2021-01-31 07:33:16 
 * @Last Modified by: dr
 * @Last Modified time: 2021-01-31 07:47:24
 */
const Controller = require('egg').Controller;
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);


class UserController extends Controller {
    async getNCMMVDetail(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let idNCMMV=ctx.query.idNCMMV || ctx.query.id;
        
        try {
            if (!idNCMMV) throw new Error(ctx.__('validate_error_params')+idNCMMV);

            let data=await service.ncmMV(idNCMMV);
            if(!data)throw new Error(ctx.__("resdata_getlist_error","网易云音乐MV详情",idNCMMV));
            // 设置响应内容和响应状态码
            ctx.helper.renderSuccess(ctx, {data});

        } catch (error) {
            debugger;
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }
            
    }
    async getNCMMVURL(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let idNCMMV=ctx.query.idNCMMV || ctx.query.id;
        
        try {
            if (!idNCMMV) throw new Error(ctx.__('validate_error_params')+idNCMMV);

            let url=await service.ncmURLMV(idNCMMV);
            if(!url)throw new Error(ctx.__("resdata_getlist_error","网易云音乐MV播放地址",idNCMMV));
            // 设置响应内容和响应状态码
            ctx.helper.renderSuccess(ctx, {data:url});

        } catch (error) {
            debugger;
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }
            
    }
}

module.exports = UserController;