/*
 * @Author: dr 
 * @Date: 2021-08-08 06:31:51 
 * @Last Modified by: dr
 * @Last Modified time: 2021-12-19 01:27:09
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
    async getInitPageData() {
        const console=this.logger;
        const ctx = this.ctx;
        let payload = ctx.params;
        let pageData = {
            //pageType: ctx.pageType || inPageType || "index",
            staticforder: 'dorawhite' ,//ctx.renderPageData()
        };
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
        pageData.navigation = await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/objNavigation.json`,{tar:this,fun:ctx.helper.reqJsonData, params:['contentCategory/getList', payload] },true,true);
        pageData.navigation.forEach(cate=>{
            let alias=dictAliasNav[cate.defaultUrl];
            if(alias)cate.alias=alias;
        })

        // pageData.site = await this.getSiteInfo();
        pageData.site = await ctx.getSiteInfo();
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
    
        // 获取通用页面信息
        let {pageData}=await this.getInitPageData();
        
        // 人物（艺术家）列表
        pageData.listArtists = (await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/listArtists.json`,{tar:this,fun:ctx.helper.reqJsonData, params:['artist/getList', {filesType:"navAvatar", pageSize: 0,isPaging:"0",}] },true,true)).docs;
        //pageData.domArtists=await ctx.renderView("dorawhite/public/compBSArtists.html",pageData.listArtists);

        // 获取分类文档列表
        let {
            pageInfo,
            listDateYear,
            docs
        } = await ctx.service.timeline.find({isRandom:true});//await ctx.helper.reqJsonData('timeline/getList', payload);
        // debugger;
        pageData.pageInfo = pageInfo;
        // pageData.listDateYear=listDateYear;
        // 时间轴内容
        pageData.posts=docs;
        // 底条数据
        pageData.dataTimelineBar={
            yearNewest:pageInfo.yearNewest || parseInt(moment(new Date()).format("YYYY")),
            yearTotal:pageInfo.yearTotal || parseInt("2015"),
            listDateYear,
        }
        return pageData;
    }
    // 优先缓存读取
    async getIndexPage(isDom=true){
        // :bsTimeline?
        let bsTimeline=this.ctx.params.bsTimeline || "news";
        const dictAliasNav={
            // "artists":"ARTIST",
            "news":"NEWS",
            "records":"ALBUM",
            "shows":"SHOW",
            "videos":"VIDEO",
            "goods":"PRODUCT",
        }
        //强制转到news；
        if(bsTimeline=="artists")return this.ctx.redirect("/artists/news");
        if(!dictAliasNav[bsTimeline]){
            return await this.getErrorPage();
        }
        let pageData=await this.getDataForIndexPage();
        // 模板的真实路径
        let pathTemplate = "dorawhite/default.html";//this.app.config.temp_view_forder + defaultTemp.alias + '/' + "2-stage-timeline" +"/" + "contentList.html";
        try {
            if(isDom){
                let dom = (await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/dom/index.html`,{tar:this.ctx,fun:this.ctx.renderView, params:[pathTemplate,pageData] },true,true));
                this.ctx.body=dom//await this.getDataForIndexPage();
                this.ctx.status = 200;
            }else{
                // ctx.tempPage在ctx.renderPageData()中使用
                this.ctx.tempPage=pathTemplate;
                await ctx.renderPageData(pageData);
            }
        } catch (err) {
            debugger;
            throw err;
        }
    }
    // 404
    async getErrorPage(){
        const console=this.logger;
        const ctx = this.ctx;
    
        // 获取通用页面信息
        let {pageData}=await this.getInitPageData();
        pageData.site.title=pageData.site.title+"404页面未找到"
        // 底条用信息
        pageData.listDateYear=[];
        pageData.pageInfo={
            yearNewest:parseInt(moment(new Date()).format("YYYY")),
            yearTotal:parseInt("2015"),
        }
        try {
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
        }catch(err){debugger}
        
        try{
            let dom=await ctx.renderView("dorawhite/404.html",pageData);
            this.ctx.body=dom;
            this.ctx.status = 200;
        } catch (err) {
            debugger;
            throw err;
        }

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