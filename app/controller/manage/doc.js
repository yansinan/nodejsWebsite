const Controller = require('egg').Controller;
const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);
const {
    siteFunc
} = require('../../utils');

class APIController extends Controller {
    get SERVICE(){ return this.ctx.service[__filename.slice(__dirname.length + 1, -3)]; }
    checkRule(){
        const {ctx}=this;

        return {
            name: {
                type: "string",
                required: true,
                min: 2,
                max: 50,
                message: ctx.__("validate_error_field", [ctx.__("label_content_title")])

            },
            alias: {
                type: "string",
                required: true,
                min: 2,
                max: 50,
                message: ctx.__("validate_error_field", [ctx.__("label_content_stitle")])
            },
            sImg: {
                type: "string",
                required: true,
                message: ctx.__("validate_error_field", [ctx.__("lc_small_images")])
            },
            discription: {
                type: "string",
                required: true,
                min: 3,
                max: 300,
                message: ctx.__("validate_error_field", [ctx.__("label_content_dis")])
            },
            comments: {
                type: "string",
                required: true,
                min: 5,
                max: 100000,
                message: ctx.__("validate_inputCorrect", [ctx.__("label_content_comments")])
                // message: res.__("validate_inputCorrect", {
                //     label: res.__("label_content_comments")
                // })
            }
        }
    }
    async renderContentTags(fieldTags){
        const {ctx}=this;

        let newTagArr = [];
        if (!_.isEmpty(fieldTags) && typeof fieldTags == 'object') {
            for (const tagItem of fieldTags) {
                let targetItem;
                if (shortid.isValid(tagItem)) {
                    targetItem = await ctx.service.contentTag.item(ctx, {
                        query: {
                            _id: tagItem
                        }
                    });
                }
                if (_.isEmpty(targetItem)) {
    
                    let thisItem = await ctx.service.contentTag.item(ctx, {
                        query: {
                            name: tagItem
                        }
                    });
    
                    if (!_.isEmpty(thisItem)) {
                        newTagArr.push(thisItem._id);
                    } else {
                        let newTag = await ctx.service.contentTag.create({
                            name: tagItem,
                            comments: tagItem
                        });
                        newTagArr.push(newTag._id);
                    }
    
                } else {
                    newTagArr.push(tagItem);
                }
            }
        }
    
        if (_.isEmpty(newTagArr)) {
            newTagArr = fieldTags;
        }
        return newTagArr
    }
    // 在create和update中使用;
    async funGetData(fields) {
        const {ctx}=this;

        //检查标签的有效性
        let newTagArr = await this.renderContentTags(fields.tags);
        // 友情链接图标
        if(fields.listLinks && fields.listLinks.length > 0 ){
            fields.listLinks.forEach(objLink => {
                if(objLink.icon=="" && objLink.url.indexOf("weibo.com")!=-1)objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("douban.com")!=-1)objLink.icon="/static/themes/images/link/logo_douban_32x32.png"
                if(objLink.icon=="" && objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png"
            });
            // 是否listLinks有更新，优先取listLinks
            let idNCM=ctx.service.artist.findIdInLink(fields.listLinks);
            if(ctx.service.artist.isNCM(fields.idNCM) && fields.idNCM!=idNCM)fields.idNCM="";//使后面同步的更新其他数据

        }

        // 关键字
        let targetKeyWords = [];
        if (fields.keywords) {
            if ((fields.keywords).indexOf(',') >= 0) {
                targetKeyWords = (fields.keywords).split(',');
            } else if ((fields.keywords).indexOf('，') >= 0) {
                targetKeyWords = (fields.keywords).split('，');
            } else {
                targetKeyWords = fields.keywords;
            }
        }
        // 作者
        
        let formObj = {
            author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
            isTop: fields.isTop || '',
            discription: xss(fields.discription),
            simpleComments: xss(fields.simpleComments),
            updateDate: new Date(),
            name: fields.name,
            alias: fields.alias,
            // stitle: fields.stitle,
            type: fields.type,
            categories: fields.categories,
            sortPath: fields.sortPath,
            tags: newTagArr,//fields.tags,
            sImg: fields.sImg,
            state: fields.state,
            dismissReason: fields.dismissReason,
            comments: fields.comments,
            type: fields.type,
        }

        // 设置显示模式
        let checkInfo = siteFunc.checkContentType(formObj.simpleComments);
        formObj.appShowType = checkInfo.type;
        formObj.imageArr = checkInfo.imgArr;
        formObj.videoArr = checkInfo.videoArr;

        formObj.simpleComments = siteFunc.renderSimpleContent(formObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

        if (checkInfo.type == '3') {
            formObj.videoImg = checkInfo.defaultUrl;
        }

        // 如果是管理员代发,则指定用户
        if (ctx.session.adminUserInfo && fields.targetUser) {
            formObj.uAuthor = fields.targetUser;
        }
        return formObj;
        
    }
    async list() {
        const {
            ctx,
            app
        } = this;
        try {
            let service=this.SERVICE;

            let payload = ctx.query;
            let state = ctx.query.state;
            let userId = ctx.query.userId;
            let queryObj = {};

            if (state) {
                queryObj.state = state
            }
            if (userId) {
                queryObj.uAuthor = userId;
            }
            let dataList = await service.find(payload, {
                query: queryObj,
                searchKeys: ['userName', 'title', 'comments', 'discription'],
            });

            ctx.helper.renderSuccess(ctx, {
                data: dataList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    }

    async create() {
        const {
            ctx,
            app
        } = this;
        let console=this.logger;

        try {
            let service=this.SERVICE;

            let fields = ctx.request.body || {};
            // 初始化用户喜欢
            fields.likeUserIds=[];
            let formObj=await this.funGetData(fields);//Object.assign({},await funGetData(ctx,fields));
            console.info("create.artist:",fields,formObj)
            //数据有效性 
            ctx.validate(this.checkRule(), formObj);

            await service.create(formObj);

            ctx.helper.renderSuccess(ctx);
        } catch (err) {
            ctx.helper.renderFail(ctx, { message: err });
        }

    }

    async getOne() {
        const {
            ctx,
            app
        } = this;
        let service=this.SERVICE;
        let _id = ctx.query.id;
        try {
            if (!shortid.isValid(_id)) throw new Error(ctx.__('validate_error_params')+_id);
            let target = await service.item(ctx, {
                query: {
                    _id: _id
                },
            });
            ctx.helper.renderSuccess(ctx, {
                data: target
            });
        } catch (err) {
            ctx.helper.renderFail(ctx, { message: err });
        }
    }

    // 文章推荐
    async updateToTop() {
        const {
            ctx,
            app
        } = this;
        let service=this.SERVICE;
        let fields = ctx.request.body || {};
        try {
            if (!fields._id) throw new Error(ctx.__('validate_error_params')+fields._id);
            await service.update(ctx, fields._id, {
                isTop: fields.isTop
            })

            ctx.helper.renderSuccess(ctx);
        } catch (err) {
            ctx.helper.renderFail(ctx, { message: err });
        }
    }

    // 文章置顶
    async roofPlacement() {
        const {
            ctx,
            app
        } = this;
        let service=this.SERVICE;
        let fields = ctx.request.body || {};
        try {
            if (!fields._id) throw new Error(ctx.__('validate_error_params')+fields._id);
            await service.update(ctx, fields._id, {
                roofPlacement: fields.roofPlacement
            })

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, { message: err });
        }
    }
    async updateOne(){
        const {
            ctx,
            app
        } = this;
        let service=this.SERVICE;
        let fields = ctx.request.body || {};
        let console=this.logger;
        try {
            if (!shortid.isValid(fields._id)) throw new Error(ctx.__('validate_error_params')+fields._id);

            let formObj=await this.funGetData(fields);//Object.assign({},await funGetData(ctx,fields));
            //数据有效性
            ctx.validate(this.checkRule(), formObj);

            await service.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }  
    }
    // fields.funUpdate: 
    // updateOne || undefined =>updateOne
    // updateList 更新各种listXXX
    async update() {
        const {
            ctx,
            app
        } = this;
        let service=this.SERVICE;
        let fields = ctx.request.body || {};
        let funUpdate= fields.funUpdate || ctx.query.funUpdate || "updateOne";
        let console=this.logger;
        // 必须使用_id
        if (!shortid.isValid(fields._id)){
            ctx.helper.renderFail(ctx, {  message: ctx.__('validate_error_params') + "\n_id:"+fields._id });
        }else if(funUpdate=="updateList"){
            await this.updateList();
        }else{
            await this.updateOne();
        }
    }

    async removes() {
        const {
            ctx,
            app
        } = this;
        let service=this.SERVICE;
        let targetIds = ctx.query.ids;
        try {
            // let draft = ctx.query.draft;
            if (!checkCurrentId(targetIds)) {
                throw new Error(ctx.__("validate_error_params"));
            } else {
                // if (draft == '1') {
                //     await service.safeDelete(ctx, targetIds, {
                //         draft: '1'
                //     });
                // } else {
                //     await ctx.service.message.removes(ctx, targetIds, 'Id');
                //     await service.removes(ctx, targetIds);
                // }
                // await ctx.service.message.removes(ctx, targetIds, 'contentId');
                await ctx.service.message.removes(ctx, targetIds, 'Id');
                await service.removes(ctx, targetIds);
            }
            
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

    //更新各种列表;
    async updateList(list={}){
        const {
            ctx,
            app
        } = this;
        let service=this.SERVICE;
        let fields = ctx.request.body || {};
        let _id=fields._id;

        let objUpdate = {} 
        let console=this.logger;

        for(let k in fields){
            let list=fields[k];
            if(list instanceof Array && (k=="listLinks" || k=="listHotMusics" || k=="listVideos" || k=="listImages" || k=="listMembers" || k=="listRefs")){
                list= list || [];
                //去重
                list=[...new Set(list)];
                // 去空数据
                list=list.filter(v=>(v));
                objUpdate[k]=list;
            }
        }
        objUpdate.updateDate=Date.now();

        try{
            // 具体情况
            if(objUpdate.listLinks){
                // 是否listLinks有更新，优先取listLinks
                let idNCM=ctx.service.artist.findIdInLink(objUpdate.listLinks);

                if (!shortid.isValid(_id)) throw new Error(ctx.__('validate_error_params')+_id);
                // 跟数据库比较是否一致
                let payload=await service.item(ctx,{query:{_id:_id},files:"_id name listLinks idNCM"})
                if(ctx.service.artist.isNCM(payload.idNCM) && payload.idNCM!=idNCM)payload.idNCM="";//重置idNCM,后面同步的更新其他网易数据

                // 网易云音乐id
                payload.idNCM=await ctx.service.artist.checkIdNCM(payload) || "";
                objUpdate.idNCM=payload.idNCM;
            }

            if (!shortid.isValid(_id)) throw new Error(ctx.__('validate_error_params')+_id);
            let resUpdate=await service.update(ctx, _id, objUpdate)
            ctx.helper.renderSuccess(ctx,{
                data: objUpdate
            });

        } catch (err) {
            debugger
            console.error(err)
            ctx.helper.renderFail(ctx, { message: err });
        }
    }
}

module.exports = APIController;
