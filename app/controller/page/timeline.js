const Controller = require('egg').Controller;
const _ = require('lodash');
const shortid = require('shortid');
const pkg = require('@root/package.json')
const validator = require('validator')
const captcha = require('trek-captcha')
const path = require('path')
const fs = require('fs')
const qr = require('qr-image')
const moment = require('moment')

class IndexController extends Controller {
    // 获取代码
    //async getJSTimeline(){
    //    try {
    //        // 组合页面信息和数组
    //        let resObj = { }
    //        //最终渲染
    //        resObj.domContainer=await ctx.renderView("../view/dorawhite/js/timeline.html",{});
    //        ctx.helper.renderSuccess(ctx, {
    //            data: resObj
    //        });
    //    } catch (err) {
    //        ctx.helper.renderFail(ctx, { message: err });
    //    }
    //}
    // 时间轴伪数据
    async getListTestTimeline(){//about___8hIKx4Ulz
        const ctx = this.ctx;
        let {
            current,
            type,
            typeId,
        } = ctx.query;
        let {
            docs,
            pageInfo,
            objTimeline
        } = await ctx.service.timeline.getTestDocs();//await ctx.helper.reqJsonData('timeline/getList', payload);
 
        try {
            // 组合页面信息和数组
            let resObj = {
                // docs : (await this.renderList(ctx, listRes)),
                pageInfo:Object.assign(pageInfo,{itemTemplate:"timeline",},{current:0,totalPage:1}),//对象模板使用时间轴模板                
            }
            //最终渲染
            //这里直接渲染模板?
            let path="../view/dorawhite/public/compBSTimelineColumn.html";//"../view/dorawhite/2-stage-timeline/listTempTimeline.html";//app/view/dorawhite/2-stage-timeline/listTempTimeline.html
            resObj.dom=await ctx.renderView(path,{posts:docs});
            if(current==1){
                resObj.domContainer=await ctx.renderView("../view/dorawhite/js/timeline.html",{});
            }
            // debugger;
            ctx.helper.renderSuccess(ctx, {
                data: resObj
            });

        } catch (err) {
           ctx.helper.renderFail(ctx, { message: err });
        }
        // ctx.helper.renderSuccess(ctx,{data:post});
        // await ctx.renderPageData(discription);
    }

}

module.exports = IndexController;