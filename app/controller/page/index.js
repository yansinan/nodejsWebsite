/*
 * @Author: dr 
 * @Date: 2021-08-08 06:31:51 
 * @Last Modified by: dr
 * @Last Modified time: 2021-08-28 23:17:19
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
    async getDataForIndexPage() {
        const ctx = this.ctx;
        ctx.query.current = ctx.params.current;
        ctx.pageType = "index";
        // console.log('-ctx.getSiteInfo();--', await ctx.getSiteInfo())
        // await ctx.getPageData();
    
        // 获取通用页面信息
        let {pageData,defaultTemp}=await ctx.getInitPageData("cate");
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
}

module.exports = IndexController;