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

    // 关于我们
    async getDataAbout(){//about___8hIKx4Ulz
        const ctx = this.ctx;

        let strCategory = ctx.params.cate1 || "about";
        let typeId=ctx.params.typeId || "";
        // let current = ctx.params.current || "last";
        if (!shortid.isValid(typeId)) {
            let resCategory = false;
            // 优先按id查找类别，没有则按名称查找
            try {
                resCategory=await ctx.service.contentCategory.item(ctx, {
                    query: {
                        defaultUrl: strCategory
                    }
                });
            } catch (err) {
                ctx.helper.renderFail(ctx, {
                    message: err
                });
            }
            typeId = resCategory._id || "";
        }
        if (!shortid.isValid(typeId)){
            ctx.helper.renderSuccess(ctx,{data:false,message:"没有找到栏目"});
            return;
        }        
        // 列表栏目中最新内容
        let listDocs=(await ctx.helper.reqJsonData("content/getList",{typeId}));
        if (!listDocs.docs || listDocs.docs.length==0) {
            ctx.helper.renderSuccess(ctx,{data:false,message:"栏目没有找到内容"});
            return;
        }
        
        listDocs=listDocs.docs;
        let post = (await ctx.helper.reqJsonData('content/getContent', { id: listDocs[0]._id }));
        //最终渲染
        ctx.helper.renderSuccess(ctx,{data:post});
        //ctx.body=post.comments;
        // await ctx.renderPageData(discription);
    }
    // 艺术家详情
    async getDataForArtistDetails() {
        const ctx = this.ctx;
        let contentId = ctx.params.id;
        if (contentId) {
            if (!shortid.isValid(contentId)) {
                ctx.redirect("/");
            } else {
                // 挂载钩子
                await this.app.hooks(ctx, 'messageBoard', {
                    contentId
                });
                // ctx.pageType = "artist"
                // 获取通用页面信息
                let {pageData,defaultTemp}=await ctx.getInitPageData("artist");//
                
                //数据提取、修改标题；需要根据post信息修改内容：pageData.post,pageData.site,pageData.ogData,ctx.tempPage
                pageData.post = await ctx.helper.reqJsonData('artist/get', { id: contentId })
                if (!_.isEmpty(pageData.post)) {
                    // 更改文档meta
                    pageData.site.title = pageData.post.name + ' '+ pageData.post.alias + ' | ' + pageData.site.title;
                    pageData.site.discription = pageData.post.discription;
                    // 获取文档所属类别下的分类列表
                    // pageData.currentCateList = await ctx.helper.reqJsonData('contentCategory/getCurrentCategoriesById', {
                    //     contentId: pageData.post._id
                    // });
                    let siteDomain = pageData.site.configs.siteDomain;
                    pageData.ogData.url = siteDomain + pageData.post.url;
                    if (pageData.post.sImg && (pageData.post.sImg).indexOf('defaultImg.jpg') < 0) {
                        pageData.ogData.img = siteDomain + pageData.post.sImg;
                    }
                    // let parentCateTemp = "";//pageData.post.categories[0].contentTemp;
                    // ctx.tempPage = ctx.getCateOrDetailTemp(defaultTemp, parentCateTemp, 'detail');

                    // TODO：不要硬编码
                    // 校验模板的真实路径
                    let themePath = this.app.config.temp_view_forder + defaultTemp.alias + '/';
                    let currentPath="2-stage-artist" + "/" + "detail.html"
                    ctx.tempPage = fs.existsSync(themePath + currentPath)?currentPath:"2-stage-default/detail.html";
                    
                } else {
                    throw new Error(ctx.__('label_page_no_power_content'));
                }
                //最终渲染
                ctx.tempPage=pageData.staticforder + '/' + ctx.tempPage;
                let dom=await ctx.renderView(ctx.tempPage, pageData);
                ctx.helper.renderSuccess(ctx,{data:{pageData,dom}});
            }
        } else {
            ctx.redirect("/");
        }
    }

    // 通用文档详情
    async getDataForDocDetails() {
        const {ctx,service} = this;
        let contentId = ctx.params.id;
        let serviceName=ctx.params.service;
        if (contentId) {
            if (!shortid.isValid(contentId) || !ctx.service[serviceName]) {
                ctx.redirect("/");
            } else {
                // 挂载钩子
                await this.app.hooks(ctx, 'messageBoard', {
                    contentId
                });
                // ctx.pageType = "artist"
                // 获取通用页面信息
                //let {pageData,defaultTemp}=await ctx.getInitPageData("artist");//
                let pageData={serviceName};
                //数据提取、修改标题；需要根据post信息修改内容：pageData.post,pageData.site,pageData.ogData,ctx.tempPage
                pageData.post = await ctx.service[serviceName].item(ctx, {
                    query : {_id:contentId},
                    populate : [],
                    files : null
                })
                if (!_.isEmpty(pageData.post)) {
                    // 根据serviceName，选用不同模板
                    if(serviceName=="record" || serviceName=="good"){
                        ctx.tempPage="../view/dorawhite/2-stage-record/detail.html";
                    }else if(serviceName=="video"){
                        ctx.tempPage="../view/dorawhite/2-stage-video/detail.html";
                    }else ctx.tempPage="../view/dorawhite/2-stage-timeline/detail.html";//"../view/dorawhite/2-stage-timeline/listTempTimeline.html";//app/view/dorawhite/2-stage-timeline/listTempTimeline.html
                    //ctx.tempPage=fs.existsSync(ctx.tempPage)?ctx.tempPage:"../view/dorawhite/2-stage-default/detail.html";
                } else {
                    throw new Error(ctx.__('label_page_no_power_content'));
                }
                //最终渲染
                // ctx.tempPage=pageData.staticforder + '/' + ctx.tempPage;

                let dom=await ctx.renderView(ctx.tempPage, pageData);
                ctx.helper.renderSuccess(ctx,{data:{pageData,dom}});
            }
        } else {
            ctx.redirect("/");
        }
    }

    // 相关内容
    async getRelativeDocs(){
        const ctx = this.ctx;
        const service = this.service;
        let {q,id}=ctx.query;
        q=q.replace(/^\s*/g,"");
        q=q.replace(/^,/g,"");
        q=q.replace(" ","|");
        q=q.replace(",","|");
        let resFind = [];
        if(q!=""){
            resFind = await service.doc.find(
                {
                    //filesType:"timelineBar", 
                    pageSize: 10,
                    isPaging:1,
                    lean:false,
                    searchkey:q,
                },{
                    //query:{
                    //    _id:{$ne:id},
                    //    //$or:[
                    //    //    {keywords: { $regex: q },},
                    //    //    {keywords: { $in: q.split("|") },},
                    //    //]
                    //},
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
        }
        let docs = resFind.docs || resFind;
        // 删除本文章，避免重复推荐
        const idx=docs.findIndex(doc=>(doc._id==id));
        if(idx!=-1)delete docs[idx];

        let pageInfo = resFind.pageInfo || {};
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
        let path="../view/dorawhite/public/relative.html";
        console.info("getDomSearch::",ctx.query,q,resObj.pageInfo);
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