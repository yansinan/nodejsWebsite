/*
 * @Author: dr 
 * @Date: 2021-12-07 18:45:41 
 * @Last Modified by: dr
 * @Last Modified time: 2021-12-07 23:03:36
 */
const _ = require('lodash')
module.exports = () => {
    return async function errorHandler(ctx, next) {
        try{
            await next();
        }catch(err){
            // debugger;
            ctx.status=500;
            let dom= await ctx.renderView("./dorawhite/error.html",{
                err,
                data:ctx.params,
            });
            // debugger
            ctx.body = {
                status:ctx.status,
                data:{
                    dom,err,
                    params:ctx.params,
                },
                message:err.message,
            }
            ctx.logger.error(err);
        }
    };
};