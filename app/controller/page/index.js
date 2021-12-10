/*
 * @Author: dr 
 * @Date: 2021-08-08 06:31:51 
 * @Last Modified by: dr
 * @Last Modified time: 2021-12-10 05:13:17
 */
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
    //所有页面通用信息
    async getInitPageData(inPageType="") {
        const console=this.logger;
        const ctx = this.ctx;
        let payload = ctx.params;
        let pageData = {
            pageType: ctx.pageType || inPageType || "index",
            staticforder: 'dorawhite' ,//ctx.renderPageData()
        };
        pageData.navigation = await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/objNavigation.json`,{tar:this,fun:ctx.helper.reqJsonData, params:['contentCategory/getList', payload] },true,true);

        // pageData.site = await this.getSiteInfo();
        pageData.site = await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/objSite.json`,{tar:ctx,fun:ctx.getSiteInfo, params:[] },true,true);
        pageData.staticRootPath = this.app.config.static.prefix;
        
        if (!_.isEmpty(pageData.site)) {
            // let ogImg = `${siteDomain}${this.app.config.static.prefix}/themes/${defaultTemp.alias}/images/mobile_logo2.jpeg`;
            pageData.ogData = {
                url: pageData.site.configs.siteDomain,
                img: `${pageData.site.configs.siteDomain}${this.app.config.static.prefix}/upload/images/defaultImg.jpg`
            };
        }

        let targetLocalJson = require('@root/config/locale/zh-CN.json')
        // 记录针对组件的国际化信息
        let sysKeys = {};
        for (let lockey in targetLocalJson) {
            if (lockey.indexOf('_layer_') > 0 || lockey.indexOf('label_system_') >= 0 || lockey.indexOf('label_uploader_') >= 0) {
                sysKeys[lockey] = ctx.__(lockey);
            }
        }

        // console.log('----ctx.hooks.---', ctx.locals['HOOK@documentDetailAfter']);
        pageData.lsk = JSON.stringify(sysKeys);
        return {pageData};
    }
    async getDataForIndexPage() {
        const console=this.logger;
        const ctx = this.ctx;
        ctx.query.current = ctx.params.current;
        ctx.pageType = "index";
        // console.info('-ctx.getSiteInfo();--', await ctx.getSiteInfo())
        // await ctx.getPageData();
    
        // 获取通用页面信息
        let {pageData}=await this.getInitPageData("cate");
        // 添加导航英文信息；
        const dictAliasNav={
            "artists":"ARTIST",
            "news":"NEWS",
            "records":"ALBUM",
            "shows":"SHOW",
            "videos":"VIDEO",
            "goods":"PRODUCT",
            "timelines":"TIMELINE",
            "abouts":"ABOUT",
        }
        pageData.navigation.forEach(cate=>{
            let alias=dictAliasNav[cate.defaultUrl];
            if(alias)cate.alias=alias;
        })
        
        // 人物（艺术家）列表
        pageData.listArtists = (await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/listArtists.json`,{tar:this,fun:ctx.helper.reqJsonData, params:['artist/getList', {filesType:"navAvatar", pageSize: 0,isPaging:"0",}] },true,true)).docs;

        
        // 获取分类文档列表
        let {
            pageInfo,
            listDateYear,
            docs
        } = await ctx.service.timeline.find({isRandom:true});//await ctx.helper.reqJsonData('timeline/getList', payload);
        // debugger;
        pageData.pageInfo = pageInfo;
        pageData.listDateYear=listDateYear;
        // 时间轴内容
        pageData.posts=docs;
        
        //最终渲染
        // 模板的真实路径
        let pathTemplate = "2-stage-timeline" +"/" + "contentTimeline.html";//this.app.config.temp_view_forder + defaultTemp.alias + '/' + "2-stage-timeline" +"/" + "contentList.html";
        pathTemplate="default.html";
        // ctx.tempPage在ctx.renderPageData()中使用
        ctx.tempPage=pathTemplate;
        await ctx.renderPageData(pageData);
    }
    async getDomSearch(){
        const ctx = this.ctx;
        const service = this.service;
        let {q}=ctx.query;
        q=q.replace(" ","|");
        let resFind = await service.doc.find(
            {
                //filesType:"timelineBar", 
                pageSize: 0,
                isPaging:0,
                lean:false,
                searchkey:q,
            },{
                // query,
                searchKeys: ['keywords', 'name', 'comments', 'discription','listRefs','tags'],
                files:"_id date listDateDur dateYear dateYYYYM dateTimeline percentDateOfYear docAlias docAliasSearch name title nameTimeline alias listRefs listLinks listFormatTags sImg tags url",
                populate:[{
                    path: 'tags listRefs listFormatTags',
                    select: 'name _id alias',
                    match:{
                        $or:[
                            {name: { $regex: q }},
                            {alias: { $regex: q }},
                        ]
                    }
                }],
                sort:{date: -1},
            });
        let docs = resFind.docs || resFind;
        let pageInfo = resFind.pageInfo || {};
        // 统计数量：
        pageInfo.objCnt={};
        docs.forEach(doc=>{
            pageInfo.objCnt[doc.docAlias]=pageInfo.objCnt[doc.docAlias] || {name:doc.docAliasSearch,cnt:0};
            pageInfo.objCnt[doc.docAlias].cnt+=1;
        })
        let pageData={
            posts:docs,
            pageInfo,
        }
        // 组合页面信息和数组
        let resObj = {
            pageInfo,
        }
        //最终渲染
        // 模板的真实路径
        let path="../view/dorawhite/public/search.html";//"../view/dorawhite/2-stage-timeline/listTempTimeline.html";//app/view/dorawhite/2-stage-timeline/listTempTimeline.html

        // pageData.staticforder = "dorawhite";
        // let pathTemplate = "public" +"/" + "search.html";//this.app.config.temp_view_forder + defaultTemp.alias + '/' + "2-stage-timeline" +"/" + "contentList.html";
        // ctx.tempPage在ctx.renderPageData()中使用
        // ctx.tempPage=pathTemplate;
        // await ctx.renderPageData(pageData);
        console.info("getDomSearch::",ctx.query,resObj);
       try {
            resObj.dom=await ctx.renderView(path,pageData);
            ctx.helper.renderSuccess(ctx, {
                data: resObj
            });
        } catch (err) {
           ctx.helper.renderFail(ctx, { message: err });
        }

    }
}

module.exports = IndexController;