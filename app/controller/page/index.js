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
    async getDataForIndexPage() {
        const ctx = this.ctx;
        ctx.query.current = ctx.params.current;
        ctx.pageType = "index";
        // console.log('-ctx.getSiteInfo();--', await ctx.getSiteInfo())
        // await ctx.getPageData();
    
        // 获取通用页面信息
        let {pageData,defaultTemp}=await ctx.getInitPageData("cate");
        // pageData.listArtists = pageData.listAvatars;

        // 模板的真实路径
        let pathTemplate = "2-stage-timeline" +"/" + "contentTimeline.html";//this.app.config.temp_view_forder + defaultTemp.alias + '/' + "2-stage-timeline" +"/" + "contentList.html";
        pathTemplate="default.html";
        // ctx.tempPage在ctx.renderPageData()中使用
        ctx.tempPage=pathTemplate;
        
        // 获取分类文档列表
        let {
            pageInfo,
            objTimeline
        } = await ctx.service.timeline.getTestDate(true);//await ctx.helper.reqJsonData('timeline/getList', payload);
        // debugger;
        pageData.pageInfo = pageInfo;
        pageData.objTimeline=objTimeline;

        //最终渲染
        await ctx.renderPageData(pageData);
    }

    // 测试新的复杂滚动首页

    // 测试用，改在controller.page.index了
    async getTestPage(){
        const ctx = this.ctx;
        ctx.pageType = "cate"
        let payload = ctx.params;
        let typeId = payload.typeId;

        // 获取通用页面信息
        let {pageData,defaultTemp}=await ctx.getInitPageData("cate");//
        let siteDomain = pageData.site.configs.siteDomain;
        //模板名称、Title
        
        // if (!_.isEmpty(pageData.cateInfo)) {
        //     let {
        //         defaultUrl,
        //         _id,
        //         contentTemp
        //     } = pageData.cateInfo;
        //     pageData.ogData.url = siteDomain + '/' + defaultUrl + '___' + _id;
        //     ctx.tempPage = ctx.getCateOrDetailTemp(defaultTemp, contentTemp, 'cate');
        // }
        let cateName = _.isEmpty(pageData.cateInfo) ? '' : (' | ' + pageData.cateInfo.name);
        pageData.site.title = pageData.site.title + cateName;

        // 模板的真实路径
        let pathTemplate = "2-stage-timeline" +"/" + "contentTimeline.html";//this.app.config.temp_view_forder + defaultTemp.alias + '/' + "2-stage-timeline" +"/" + "contentList.html";
        // ctx.tempPage在ctx.renderPageData()中使用
        ctx.tempPage=pathTemplate;
        // 获取分类文档列表
        let {
            pageInfo,
            objTimeline
        } = await ctx.service.timeline.getTestDate(true);//await ctx.helper.reqJsonData('timeline/getList', payload);
        // debugger;
        pageData.pageInfo = pageInfo;
        pageData.objTimeline=objTimeline;
        //最终渲染
        await ctx.renderPageData(pageData);


        return 
        let year = ctx.params.year; //按年查询
        let current = ctx.params.current;

        
        if (typeId) {
            if (!shortid.isValid(typeId)) {
                ctx.redirect("/");
            } else {
                // TODO:验证数据正确性
                if (year) {
                    if (validator.isNumeric(year)) {
                        // await ctx.getPageData();
                        ctx.params.dateStart = new Date(year+"-12-31");
                    } else {
                        ctx.redirect("/");
                    }
                }else{
                    // TODO:验证日期正确性；
                    // 如果完全没有定义时间，则默认从现在起
                    if(!ctx.params.dateStart){
                        ctx.params.dateStart= (new Date());
                    }
                }
                // 验证页码的正确性
                if (current && !validator.isNumeric(current)) {
                    ctx.redirect("/");
                }

                let dateStart = ctx.params.dateStart; //按周期查询，起始日期往前365*2天
                
                // 获取通用页面信息
                // ctx.pageType = "cate"
                let {pageData,defaultTemp}=await ctx.getInitPageData("cate");//
                let payload = ctx.params;
                let siteDomain = pageData.site.configs.siteDomain;

                //数据提取、修改标题；需要根据post信息修改内容：pageData.post,pageData.site,pageData.ogData,ctx.tempPage
                if (payload.typeId) {
                    // 获取指定类别下的子类列表
                    pageData.currentCateList = await ctx.helper.reqJsonData('contentCategory/getCurrentCategoriesById', {
                        typeId: payload.typeId
                    });
                    // 获取当前分类的基本信息
                    pageData.cateInfo = await ctx.helper.reqJsonData('contentCategory/getOne', {
                        id: payload.typeId
                    });
                }

                if (!_.isEmpty(pageData.cateInfo)) {
                    let {
                        defaultUrl,
                        _id,
                        contentTemp
                    } = pageData.cateInfo;
                    pageData.ogData.url = siteDomain + '/' + defaultUrl + '___' + _id;
                    ctx.tempPage = ctx.getCateOrDetailTemp(defaultTemp, contentTemp, 'cate');
                }
                let cateName = _.isEmpty(pageData.cateInfo) ? '' : (' | ' + pageData.cateInfo.name);
                pageData.site.title = pageData.site.title + cateName;
                // 获取分类文档列表
                let {
                    docs,
                    pageInfo
                } = await ctx.helper.reqJsonData('timeline/getList', payload);
                pageData.posts = docs;
                pageData.pageInfo = pageInfo;
                
                //最终渲染
                await ctx.renderPageData(pageData);
                
            }
        } else {
            ctx.redirect("/");
        }
    }
}

module.exports = IndexController;