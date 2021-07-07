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
        let {pageData,defaultTemp}=await ctx.getInitPageData("cate");
        pageData.listArtists = pageData.listAvatars;

        // 模板的真实路径
        let pathTemplate = "2-stage-timeline" +"/" + "contentTimeline.html";//this.app.config.temp_view_forder + defaultTemp.alias + '/' + "2-stage-timeline" +"/" + "contentList.html";
        // ctx.tempPage在ctx.renderPageData()中使用
        ctx.tempPage=pathTemplate;
        // 获取所有标签，给getTestData用
        let listTagsAll=await ctx.service.contentTag.find({isPaging: '0'});
        listTagsAll=JSON.parse(JSON.stringify(listTagsAll));
        
        // 获取分类文档列表
        let {
            docs,
            pageInfo,
            objTimeline
        } = this.getTestData(listTagsAll);//await ctx.helper.reqJsonData('timeline/getList', payload);
        // debugger;
        pageData.posts = docs;
        pageData.pageInfo = pageInfo;
        pageData.objTimeline=objTimeline;


        //最终渲染
        await ctx.renderPageData(pageData);
    }
    // 测试新的复杂滚动首页
    // 生成伪数据
    getTestData(listTagsAll){
        let pageInfo={            
            current:1,
            itemTemplate:'timeline',
            pageSize:10,
            searchkey:'',
            state:'2',
            totalItems:12,
            totalPage:2,
        }
        let doc={
            
            _id:'EXxamHvLe',
            alias:'Click#15 X Rustic平安夜专场正式开票',
            date:'2021-01-15',
            dateTimeline:'01-15',
            dateYear:'2021 ',
            discription:'我们给这场演出取名“Two Sides，One Man”。是的，这场演出由Ricky而来，但它不仅是一个拼场演出，还浓缩了一段跨越十年，爱恨交织的旧事。12月24日，杭州大麦66Live，两个Ricky人生中最重要的乐队将在这一天同台，他的过去与现在也将在这一天，这个舞台上重叠。',
            hasComment:false,
            hasDespise:false,
            hasFavorite:false,
            hasPraised:false,
            id:'EXxamHvLe',
            name:'Click#15 X Rustic平安夜专场正式开票',
            sImg:'/static/upload/images/20210115/1610679221136585273.jpg',
            strCate:'details',
            strCateTip:'消息',
            // tags:(1) [{…}],
            url:'/details/EXxamHvLe.html',
            widthTemp:10,
        }
        let docs=[]
        let timeLast=new Date().getTime();
        let dateFirst=new Date(timeLast);
        let dateLast=new Date("2018/07/01");
        let timeRange=dateFirst.getTime()-dateLast.getTime();
        let cntDays=Math.round(timeRange/(1000*60*60*24));
        // 生成全部日期数组
        let listIdxDays=[]
        let listDateAll=[];
        let listIdxYears=[];
        let listIdxSeasons=[];
        for(let i=0 ;i<cntDays;i++){
            let posX=(i*100/cntDays).toFixed(1);
            // let date=timeLast-Math.floor(Math.random()*1000*60*60*24*5);
            if(Math.random()<(500/cntDays)){
                let date=timeLast-Math.floor(Math.random()*1000*60*60*24*5);
                listIdxDays.push(posX);
                listDateAll.push(date);
                timeLast=new Date(date).getTime();
            }
            let dateTmp=new Date(dateFirst);
            dateTmp.setTime(dateTmp.setDate(dateTmp.getDate()-i));
            
            let m=dateTmp.getMonth()+1;
            if(m%3==0 && dateTmp.getDate()==1){
                listIdxSeasons.push({x:posX,strTitle:m+"月"});
                if(m==12)listIdxYears.push({x:posX,strTitle:dateTmp.getFullYear()+1,});
            }
        }
        let objTimeline={
            listIdxDays,
            listIdxSeasons,
            listIdxYears,
            dateFirst,
            dateLast,
            cntDays,
            widthPercent:(100/cntDays).toFixed(1),

        }

        
        let listImg=this.ctx.service.uploadFiles.listUrlImg();

        for(let i=0 ; i<100;i++){
            let _id=shortid.generate();
            let idxSubstring=Math.floor(Math.random()*doc.discription.length)
            let title=doc.discription.substring(idxSubstring,idxSubstring+10+Math.round(Math.random()*20));
            let date=new Date(listDateAll[i]);
            
            // 标签
            let idxStart=Math.floor(Math.random()*(listTagsAll.length));
            let idxRange=Math.min(listTagsAll.length-idxStart,3);
            let idxEnd=idxStart+2+Math.floor(Math.random()*idxRange);
            let listTags=listTagsAll.slice(idxStart,idxEnd);
            docs.push(Object.assign({},doc,{
                _id:_id,
                id:_id,
                alias:title,
                name:title,
                sImg:listImg[Math.floor(Math.random()*listImg.length)],
                date:moment(date).format("YYYY-MM-DD"),
                dateYear:moment(date).format("YYYY"),
                dateTimeline:moment(date).format("MM/DD"),
                dateYYMM:" "+moment(date).format("YYYYM"),
                dateMM:" "+moment(date).format("M月"),
                tags:listTags,
            }))
        }
        return {docs,pageInfo,objTimeline}
    }
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
        // 获取所有标签
        let listTagsAll=await ctx.service.contentTag.find({isPaging: '0'});
        listTagsAll=JSON.parse(JSON.stringify(listTagsAll));
        // 获取分类文档列表
        let {
            docs,
            pageInfo,
            objTimeline
        } = this.getTestData(listTagsAll);//await ctx.helper.reqJsonData('timeline/getList', payload);
        // debugger;
        pageData.posts = docs;
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