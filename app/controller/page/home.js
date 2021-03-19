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

class HomeController extends Controller {

    // 获取页面基础信息
    async getSiteInfo(ctx, appConfig) {
        let configs = await ctx.helper.reqJsonData('systemConfig/getConfig');
        const {
            siteName,
            siteDiscription,
            siteKeywords,
            siteAltKeywords,
            ogTitle,
            siteLogo
        } = configs || [];

        let {
            title,
            des,
            keywords
        } = ctx.params;
        let pageTitle = title ? (title + ' | ' + siteName) : siteName;
        let discription = des ? des : siteDiscription;
        let key = keywords ? keywords : siteKeywords;
        let altkey = siteAltKeywords || '';
        return {
            title: pageTitle,
            siteLogo,
            ogTitle,
            discription,
            key,
            altkey,
            configs: configs || [],
            version: pkg.version,
            lang: ctx.session.locale,
            router: ctx.originalUrl.split('/')[1]
        }

    }

    async getImgCode(ctx, app) {

        const {
            token,
            buffer
        } = await captcha();
        ctx.session.imageCode = token;
        ctx.set('Content-Type', 'image/png');
        ctx.status = 200;
        ctx.body = buffer;
    }

    async createQRCode(ctx, app) {
        var text = ctx.request.query.text || "";
        if (text) {
            let img = qr.image(text, {
                size: 10
            });
            ctx.set('Content-Type', 'image/png');
            ctx.status = 200;
            ctx.body = img;
        } else {
            throw new Error(ctx.__('validate_error_params'));
        }
    }

    async getRobotsPage(ctx) {
        let stream = fs.readFileSync(path.join(__dirname, '../../../robots.txt'), 'utf-8');
        ctx.body = stream;
    }



    async getSiteMapPage() {
        // 获取站点配置
        let configs = await this.ctx.helper.reqJsonData('systemConfig/getConfig');
        let root_path = configs.siteDomain;
        let priority = 0.8;
        let freq = "weekly";
        let lastMod = moment().format("YYYY-MM-DD");
        let xml =
            '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        xml += "<url>";
        xml += "<loc>" + root_path + "</loc>";
        xml += "<changefreq>daily</changefreq>";
        xml += "<lastmod>" + lastMod + "</lastmod>";
        xml += "<priority>" + 1 + "</priority>";
        xml += "</url>";

        // 类别地图
        let allCategories = await this.ctx.helper.reqJsonData('contentCategory/getList');
        allCategories.forEach(function (cate) {
            xml += "<url>";
            xml +=
                "<loc>" + root_path + cate.url + "</loc>";
            xml += "<changefreq>weekly</changefreq>";
            xml += "<lastmod>" + lastMod + "</lastmod>";
            xml += "<priority>0.8</priority>";
            xml += "</url>";
        });

        // 文档地图
        let allContents = await this.ctx.helper.reqJsonData('content/getList', {
            isPaging: '0'
        });
        allContents.forEach(function (post) {
            xml += "<url>";
            xml += "<loc>" + root_path + post.url + "</loc>";
            xml += "<changefreq>weekly</changefreq>";
            xml += "<lastmod>" + lastMod + "</lastmod>";
            xml += "<priority>0.5</priority>";
            xml += "</url>";
        });
        xml += "</urlset>";
        this.ctx.set('Content-Type', 'application/xml');
        this.ctx.body = xml;
    }

    async getDataForIndexPage() {
        const ctx = this.ctx;
        ctx.query.current = ctx.params.current;
        ctx.tempPage = 'index.html';
        ctx.pageType = "index";
        // console.log('-ctx.getSiteInfo();--', await ctx.getSiteInfo())
        await ctx.getPageData();
    }

    async getDataForCatePage() {
        const ctx = this.ctx;
        ctx.pageType = "cate"
        let typeId = ctx.params.typeId;
        let current = ctx.params.current;
        if (typeId) {
            if (!shortid.isValid(typeId)) {
                ctx.redirect("/");
            } else {
                if (current) {
                    if (validator.isNumeric(current)) {
                        await ctx.getPageData();
                    } else {
                        ctx.redirect("/");
                    }
                } else {
                    await ctx.getPageData();
                }
            }
        } else {
            ctx.redirect("/");
        }
    }

    async getDataForSearchPage() {
        const ctx = this.ctx;
        ctx.pageType = "search"
        let searchkey = ctx.params.searchkey;
        let current = ctx.params.current;
        if (searchkey) {
            if (current) {
                if (validator.isNumeric(current)) {
                    await ctx.getPageData();
                } else {
                    ctx.redirect("/");
                }
            } else {
                await ctx.getPageData();
            }
        } else {
            ctx.redirect("/");
        }
    }

    async getDataForTagPage() {
        const ctx = this.ctx;
        ctx.pageType = "tag";
        let tagName = ctx.params.tagName;
        let current = ctx.params.current;
        if (tagName) {
            if (current) {
                if (validator.isNumeric(current)) {
                    await ctx.getPageData();
                } else {
                    ctx.redirect("/");
                }
            } else {
                await ctx.getPageData();
            }
        } else {
            ctx.redirect("/");
        }
    }

    async getDataForAuthorPage() {
        const ctx = this.ctx;
        ctx.pageType = "author";
        ctx.tempPage = 'author.html';
        let userId = ctx.params.userId;
        let current = ctx.params.current;
        if (userId) {
            if (!shortid.isValid(userId)) {
                ctx.redirect("/");
            } else {
                if (current) {
                    if (validator.isNumeric(current)) {
                        await ctx.getPageData();
                    } else {
                        ctx.redirect("/");
                    }
                } else {
                    await ctx.getPageData();
                }
            }
        } else {
            ctx.redirect("/");
        }
    }

    async getDataForContentDetails() {
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
                ctx.pageType = "detail"
                await ctx.getPageData();
            }
        } else {
            ctx.redirect("/");
        }
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
                await ctx.renderPageData(pageData);
            }
        } else {
            ctx.redirect("/");
        }
    }
    //艺术家列表
    async getDataForArtistsPage() {
        const ctx = this.ctx;
        ctx.pageType = "cate"
        let typeId = ctx.params.typeId;
        let current = ctx.params.current;
        if (typeId) {
            if (!shortid.isValid(typeId)) {
                ctx.redirect("/");
            } else {
                if (current) {
                    if (validator.isNumeric(current)) {
                        // await ctx.getPageData();
                    } else {
                        ctx.redirect("/");
                    }
                }
                
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
                } = await ctx.helper.reqJsonData('artist/getList', payload);
                pageData.posts = docs;
                pageData.pageInfo = pageInfo;
                //最终渲染
                await ctx.renderPageData(pageData);
                
            }
        } else {
            ctx.redirect("/");
        }
    }
    // 专辑详情
    async getDataForRecordDetails() {
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
                // ctx.pageType = "record"
                // 获取通用页面信息
                let {pageData,defaultTemp}=await ctx.getInitPageData("record");//
                
                //数据提取、修改标题；需要根据post信息修改内容：pageData.post,pageData.site,pageData.ogData,ctx.tempPage
                pageData.post = await ctx.helper.reqJsonData('record/get', { id: contentId })
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
                    let currentPath="2-stage-record" + "/" + "detail.html"
                    ctx.tempPage = fs.existsSync(themePath + currentPath)?currentPath:"2-stage-default/detail.html";
                    
                } else {
                    throw new Error(ctx.__('label_page_no_power_content'));
                }
                //最终渲染
                await ctx.renderPageData(pageData);
            }
        } else {
            ctx.redirect("/");
        }
    }
    //专辑列表
    async getDataForRecordsPage() {
        const ctx = this.ctx;
        ctx.pageType = "cate"
        let typeId = ctx.params.typeId;
        let current = ctx.params.current;
        if (typeId) {
            if (!shortid.isValid(typeId)) {
                ctx.redirect("/");
            } else {
                if (current) {
                    if (validator.isNumeric(current)) {
                        // await ctx.getPageData();
                    } else {
                        ctx.redirect("/");
                    }
                }
                
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
                } = await ctx.helper.reqJsonData('record/getList', payload);
                pageData.posts = docs;
                pageData.pageInfo = pageInfo;
                
                //最终渲染
                await ctx.renderPageData(pageData);
                
            }
        } else {
            ctx.redirect("/");
        }
    }

    // 时间线
    async getDataForTimelinePage() {
        const ctx = this.ctx;
        ctx.pageType = "cate"
        let typeId = ctx.params.typeId;
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
    async getDataForSiteMap() {
        const ctx = this.ctx;
        ctx.tempPage = 'sitemap.html';
        ctx.pageType = "sitemap"
        await ctx.getPageData();
    }

    async getDataForErr() {
        const ctx = this.ctx;
        ctx.tempPage = 'public/do' + ctx.errNo + '.html';
        ctx.modules = [{
            action: 'get_error_info_' + ctx.errNo
        }];
        await ctx.getPageData();
    }


    async getDataForPhoneCategory() {
        const ctx = this.ctx;
        ctx.tempPage = 'mb/phone-fenlei.html';
        ctx.pageType = 'phone_fenlei'
        await ctx.getPageData();
    }

    async getDataForPhoneList() {
        const ctx = this.ctx;
        ctx.tempPage = 'mb/phone-list.html';
        ctx.pageType = 'phone_list'
        await ctx.getPageData();
    }

    async getDataForPhoneUser() {
        const ctx = this.ctx;
        ctx.tempPage = 'mb/phone-user.html';
        ctx.pageType = 'phone_list'
        await ctx.getPageData();
    }


}

module.exports = HomeController;