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
        const {ctx,service} = this;
        let {
            //current,//标识当前请求页码
            yearCurrent,//当前客户端最后年份;
            type,//读取类型dom
            typeId,//栏目id,改用cateName
            cateName,//栏目别名
        } = ctx.query;
        const dictService={
            news:service.timeline,//service.doc,
            records:service.timeline,//service.record,
            artists:service.timeline,//service.artist,
            shows:service.timeline,//service.show,
            goods:service.timeline,//false,//service.docs,
            videos:service.timeline,//service.video,
        };
        let objData={
            docs:false,
            pageInfo:false,
            objTimeline:false,
        }
        // 尝试获取栏目信息
        //let listCates = await service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/objNavigation.json`,{tar:this,fun:ctx.helper.reqJsonData, params:['contentCategory/getList', payload] },true,true);
        //let objCate=listCates.find(v=>(v.name=cateName)) || false;
        // 

        if(!dictService[cateName])objData = await ctx.service.timeline.getTestDocs();//await ctx.helper.reqJsonData('timeline/getList', payload);
        else {
            // 从不同service获取数据的列表
            let files = '_id url name alias sImg date discription imageArr videoArr simpleComments comments state categories isTop listArtists listFormatTags dateRelease catalog listLinks dateYYMM dateYear dateTimeline'

            objData = await dictService[cateName].find(
                {
                    filesType:"timeline", 
                    pageSize: 2000,
                    isPaging:"1",
                    isRandom:false,
                    lean:false,
                    yearCurrent,
                },{
                    query:{state: '2'},
                    files:files,
                    sort:{dateRelease: -1},
                });
            // {filesType:"navAvatar", pageSize: 0,isPaging:"0",}
            // 处理成时间轴格式
            objData.docs=JSON.parse(JSON.stringify(objData.docs))
        }
        // 组合页面信息和数组
        let resObj = {
            pageInfo:objData.pageInfo,//对象模板使用时间轴模板                
        }
        //最终渲染
        //这里直接渲染模板?
        let path="../view/dorawhite/public/compBSTimelineColumn.html";//"../view/dorawhite/2-stage-timeline/listTempTimeline.html";//app/view/dorawhite/2-stage-timeline/listTempTimeline.html
        
        try {
            resObj.dom=await ctx.renderView(path,{posts:objData.docs});
            resObj.domTimelineBar=await ctx.renderView("../view/dorawhite/public/compTimelineBar.html",{listDateYear:objData.listDateYear});
            if(type.indexOf("script")){
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