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
        ctx.tempPage = 'index.html';
        ctx.pageType = "index";
        // console.log('-ctx.getSiteInfo();--', await ctx.getSiteInfo())
        // await ctx.getPageData();
    
        // 获取通用页面信息
        let {pageData,defaultTemp}=await ctx.getInitPageData("artist");
        pageData.listArtists = pageData.listAvatars;

        // // 获取分类文档列表
        // let {
        //     docs,
        //     pageInfo
        // } = await ctx.helper.reqJsonData('artist/getList', {filesType:"navAvatar"});
        // pageData.pageInfo = pageInfo;
        //最终渲染
        await ctx.renderPageData(pageData);
    }


}

module.exports = IndexController;