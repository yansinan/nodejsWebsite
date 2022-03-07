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
        // 设置about单独的样式参数
        post.docAlias="news about"
        // 计算时间轴
        let dateEnd="20220204";
        let dateStart="20150507";
        // 年份&日期
        let listYears=this.getTestDateByYear(dateEnd,dateStart,[]);
        // 成员数据
        let listPeople=await this.getTestListPeople(50,dateEnd,dateStart);
        //汇总数据
        let pageData={serviceName:"about",post,listYears,listPeople};
        
        // 定义模板
        if (!_.isEmpty(pageData.post)) {
            //数据提取、修改标题；需要根据post信息修改内容：pageData.post,pageData.site,pageData.ogData,ctx.tempPage
            
            // 模板路径
            let tempPage="../view/dorawhite/2-stage-about/detail.html";
            // 渲染
            try {
                let dom=await ctx.renderView(tempPage, pageData);
                ctx.helper.renderSuccess(ctx,{data:{pageData,dom}});
            } catch (err) {
                ctx.throw(500,"模板渲染错误");
            }
        } else {
            ctx.throw(500,"关于赤瞳的内容未找到");
            throw new Error(ctx.__('label_page_no_power_content'));
        }

        //最终渲染
        // ctx.helper.renderSuccess(ctx,{data:post});
        //ctx.body=post.comments;
        // await ctx.renderPageData(discription);
    }
    async getStaffs(){
        const ctx = this.ctx;
        // 计算时间轴
        let dateEnd="20220204";
        let dateStart="20150507";
        // 年份&日期
        let listYears=this.getTestDateByYear(dateEnd,dateStart,[]);
        // 成员数据
        let listPeople=await this.service.user.find({
            filesType:"timeline", 
            pageSize: 2000,
            isPaging:"0",
            lean:false,
        },{
            query:{group: ['工作人员','乐手']},
            // files:files,
            sort:{dateIn: -1},
        })
        listPeople=JSON.parse(JSON.stringify(listPeople));
        listPeople=listPeople.concat(await this.getTestListPeople(50,dateEnd,dateStart));
        //汇总数据
        let pageData={serviceName:"about",listYears,listPeople};
        
        // 定义模板
            
        // 模板路径
        let tempPage="../view/dorawhite/2-stage-about/staffs.html";
        // 渲染
        try {
            let dom=await ctx.render(tempPage, pageData);
            // ctx.helper.renderSuccess(ctx,{data:dom});
        } catch (err) {
            ctx.throw(500,"模板渲染错误");
        }
    }
    // 伪人员信息
    async getTestListPeople(cntPeople,inDateEnd,inDateStart){
        const {ctx,service} = this;
        const text='赵钱孙李周吴郑王严陈赵钱孙李周吴郑王严陈';
        let listImgs=await service.uploadFiles.listUrlImg();

        let listPeople=[];
        for(let i=0;i<cntPeople;i++){
            // 随机名字
            let idxSubstring=Math.floor(Math.random()*(text.length-4))
            let name=text.substr(idxSubstring,2+Math.round(Math.random()*2));
            // 随即日期
            let cntDays=moment(inDateEnd).diff(inDateStart,"days");
            let dateStart=moment(inDateEnd).subtract(Math.random()*cntDays,"days").format("YYYY-MM-DD");
            // 到今天
            let cntDaysStart=moment().diff(dateStart,"days");
            let dateEnd= Math.random() < 0.9 ? (moment().subtract(Math.floor(Math.random()*cntDaysStart),"days")) : "";
            let avatar=listImgs[Math.floor(Math.random()*listImgs.length)];
            let objPeople={
                name:name,
                avatarName:name.substring(0,1),//firstName
                dateInYYYYMM:moment(dateStart).format("YYYYMM"),//dateStart
                dateOutYYYYMM:dateEnd!="" ? moment(dateEnd).format("YYYYMM") : "",//dateEnd
                avatar:Math.random()<0.1 ? "" :avatar,
            }
            listPeople.push(objPeople);
        }
        return listPeople;
    }
    // 伪人员信息：按日期生成伪数据
    getTestDateByYear(dateEnd,dateStart,inListDocsOfYear=[]){
        let listRes=[];
        // 年份对象;
        let objForYear={
            listEle:[],
            strYear:moment(dateEnd).format("YYYY"),
        }
        let cntDays=moment(dateEnd).diff(moment(dateStart),"days");//Math.round(timeRange/(1000*60*60*24));
        for(let i=0 ;i<=cntDays;i++){
            let dateTmp=moment(dateEnd).subtract(i, 'days');

            // 月份第一天，划线
            if(dateTmp.format("D")=="1"){
                // 单位节点：可能是月份或季度
                let objEle={
                    name:"",
                    isStartOfYear:"",
                }
                objEle.name=dateTmp.format("YYYY-MM");
                // 添加到当年份
                objForYear.listEle.push(objEle);
                if(dateTmp.format("MMDD")=="0101"){
                    objEle.isStartOfYear=dateTmp.format("YYYY");
                    
                    listRes.push(objForYear)
                    objForYear={
                        listEle:[],
                        strYear:dateTmp.subtract(1, 'years').format("YYYY"),
                    }
                }
            }
        }
        return listRes;
    }
    // 艺术家详情
    /*
    async getDataForArtistDetails() {
        const ctx = this.ctx;
        let contentId = ctx.params.id;
        ctx.params.serviceName="artist";
        let serviceName=ctx.params.serviceName;
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
                pageData.serviceName=serviceName;
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
                    ctx.throw(500,"艺术家已删除");
                    throw new Error(ctx.__('label_page_no_power_content'));
                }
                //最终渲染
                ctx.tempPage=pageData.staticforder + '/' + ctx.tempPage;
                try {
                    let dom=await ctx.renderView(ctx.tempPage, pageData);
                    ctx.helper.renderSuccess(ctx,{data:{pageData,dom}});
                } catch (err) {
                    ctx.throw(500,"模板渲染错误");
                }

            }
        } else {
            ctx.redirect("/");
        }
    }
    */
    // 通用文档详情
    async getDataForDocDetails() {
        const {ctx,service} = this;
        let contentId = ctx.params.id;
        let serviceName=ctx.params.service;
        //let res={
        //    status: 500,
        //    message: message,
        //    data: data || {},
        //}
        //debugger
        //let dom=await ctx.renderView("../view/dorawhite/public/error.html",res);
        // throw new Error("错误测试dr");
        // return;
        //ctx.throw(500,"错误测试");
        //return;
        //await ctx.helper.renderFail(ctx, { message: "错误测试" });
        //return;
        
        if (contentId) {
            if (!shortid.isValid(contentId) || !ctx.service[serviceName]) {
                ctx.redirect("/");
            } else {
                // 挂载钩子
                //await this.app.hooks(ctx, 'messageBoard', {
                //    contentId
                //});
                // 浏览次数+1
                ctx.service[serviceName].inc && await ctx.service[serviceName].inc(ctx, contentId, { 'clickNum': 1 });
                
                //获取数据
                let pageData={serviceName};
                //数据提取、修改标题；需要根据post信息修改内容：pageData.post,pageData.site,pageData.ogData,ctx.tempPage
                pageData.post = await ctx.service[serviceName].item(ctx, {
                    query : {_id:contentId},
                    populate : [],
                    files : null
                })
                // 定义模板
                if (!_.isEmpty(pageData.post)) {
                    // 根据serviceName，选用不同模板
                    if(serviceName=="record" || serviceName=="good"){
                        ctx.tempPage="../view/dorawhite/2-stage-record/detail.html";
                    }else if(serviceName=="video"){
                        ctx.tempPage="../view/dorawhite/2-stage-video/detail.html";
                    }else if(serviceName=="artist"){
                        ctx.tempPage="../view/dorawhite/2-stage-artist/detail.html";
                    }else ctx.tempPage="../view/dorawhite/2-stage-timeline/detail.html";//"../view/dorawhite/2-stage-timeline/listTempTimeline.html";//app/view/dorawhite/2-stage-timeline/listTempTimeline.html
                    //ctx.tempPage=fs.existsSync(ctx.tempPage)?ctx.tempPage:"../view/dorawhite/2-stage-default/detail.html";
                } else {
                    ctx.throw(500,"文档已删除");
                    throw new Error(ctx.__('label_page_no_power_content'));
                }
                //最终渲染
                // ctx.tempPage=pageData.staticforder + '/' + ctx.tempPage;
                try {
                    let dom=await ctx.renderView(ctx.tempPage, pageData);
                    ctx.helper.renderSuccess(ctx,{data:{pageData,dom}});
                } catch (err) {
                    ctx.throw(500,"模板渲染错误");
                }
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
                    query:{
                    //    _id:{$ne:id},
                    //    //$or:[
                    //    //    {keywords: { $regex: q },},
                    //    //    {keywords: { $in: q.split("|") },},
                    //    //]
                        state: '2',
                        draft:{"$ne":"1"},
                    },
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
        // if(idx!=-1)delete docs[idx];
        if(idx!=-1)docs.splice(idx,1);

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
        ctx.logger.info("getDomSearch::",ctx.query,q,resObj.pageInfo);
        try {
            resObj.dom=await ctx.renderView(path,pageData);
            ctx.helper.renderSuccess(ctx, {
                data: resObj
            });
        } catch (err) {
            ctx.throw(500,"模板渲染错误");
        }

    }    
}

module.exports = IndexController;