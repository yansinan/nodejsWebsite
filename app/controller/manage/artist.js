const Controller = require('egg').Controller;
const BaseController = require('./doc');

const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);
const {
    siteFunc
} = require('../../utils');




class APIController extends BaseController {
    get SERVICE(){ return this.ctx.service[__filename.slice(__dirname.length + 1, -3)]; }

    // checkRule(){
    //     const {ctx}=this;
    //     return {
    //         name: {
    //             type: "string",
    //             required: true,
    //             min: 2,
    //             max: 50,
    //             message: ctx.__("validate_error_field", [ctx.__("label_content_title")])
    //         },
    //         alias: {
    //             type: "string",
    //             required: true,
    //             min: 2,
    //             max: 50,
    //             message: ctx.__("validate_error_field", [ctx.__("label_content_stitle")])
    //         },
    //         sImg: {
    //             type: "string",
    //             required: true,
    //             message: ctx.__("validate_error_field", [ctx.__("lc_small_images")])
    //         },
    //         discription: {
    //             type: "string",
    //             required: true,
    //             min: 3,
    //             max: 300,
    //             message: ctx.__("validate_error_field", [ctx.__("label_content_dis")])
    //         },
    //         comments: {
    //             type: "string",
    //             required: true,
    //             min: 5,
    //             max: 100000,
    //             message: ctx.__("validate_inputCorrect", [ctx.__("label_content_comments")])
    //             // message: res.__("validate_inputCorrect", {
    //             //     label: res.__("label_content_comments")
    //             // })
    //         }
    //     }
    // }

    // // 在create和update中使用;
// 乐队成员有效性
    async renderListMembers(fieldTags){
        const {ctx}=this;
        let newTagArr = [];
        if (!_.isEmpty(fieldTags) && typeof fieldTags == 'object') {
            for (const tagItem of fieldTags) {
                let targetItem;
                //优先按user.id为准
                if (shortid.isValid(tagItem)) {
                    targetItem = await ctx.service.user.item(ctx, {
                        query: {
                            _id: tagItem
                        }
                    });
                }
                //万一user.id没有，则尝试是否是名字
                if (_.isEmpty(targetItem)) {

                    let thisItem = await ctx.service.user.item(ctx, {
                        query: {
                            name: tagItem
                        }
                    });
                    //tag有名字，更正id；user没找到名字（并且前面确认了不是id），则排除出去
                    if (!_.isEmpty(thisItem)) {
                        newTagArr.push(thisItem._id);
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
    async funGetData(fields){
        const {ctx}=this;
        let formObj=await super.funGetData(fields);

        //TODO 20201213: 检查乐队成员的有效性
        let newListMember= await this.renderListMembers(fields.listMembers);
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
        // 网易云音乐id
        fields.idNCM=await ctx.service.artist.checkIdNCM(fields) || "";

        // debugger;
        //获取mv播放文件地址
        // let urlMV=await ctx.service.video.ncmURLMV(listMVs[0].idURL);
        // debugger
        
        Object.assign(formObj , {
            // author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
            // isTop: fields.isTop || '',
            // discription: xss(fields.discription),
            // simpleComments: xss(fields.simpleComments),
            // updateDate: new Date(),
            // name: fields.name,
            // alias: fields.alias,
            // // stitle: fields.stitle,
            // type: fields.type,
            // categories: fields.categories,
            // sortPath: fields.sortPath,
            // tags: newTagArr,//fields.tags,
            // sImg: fields.sImg,
            // state: fields.state,
            // dismissReason: fields.dismissReason,
            // comments: fields.comments,
            // type: fields.type,
            listMembers:newListMember,//fields.listMembers,
            from:fields.from,
            listDateDur:fields.listDateDur,
            listHotMusics:fields.listHotMusics,
            listLinks:fields.listLinks,
            listImages:fields.listImages,
            listVideos:fields.listVideos,
            idNCM:fields.idNCM,
        });
        // 设置创建日期为加入日期
        if(formObj.listDateDur && formObj.listDateDur[0]){
            formObj.date=formObj.listDateDur[0];
        }

        return formObj;
        
    }

    async getOne() {
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let _id = ctx.query.id;
        try {
            if (!shortid.isValid(_id)) throw new Error(ctx.__('validate_error_params')+_id);

            let target = await service.item(ctx, {
                query: {
                    _id: _id
                },
            });
            // 网易云音乐id
            target.idNCM=await service.checkIdNCM(target);
            ctx.helper.renderSuccess(ctx, {
                data: target
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    }

    // 相册上传
    async updateAlbum() {
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let console=this.logger;

        try {
            // 接收上传文件以及parts.field
            let resUpload=await ctx.service.uploadFiles.create();
            // resUpload={
            //     path: listReturenPath[0],
            //     listPath:listReturenPath,
            //     listInfoImage:listObjImage,
            //     field:ctx.request.body,
            // }
            let fields = resUpload.field || ctx.request.body || {};

            if (!shortid.isValid(fields._id)) throw new Error(ctx.__('validate_error_params')+fields._id);
            //检索最新listImages
            let target = await service.item(ctx, {
                query: {
                    _id: fields._id
                },
                files:"_id name url listImages updateDate"
            });
            let listImages = JSON.parse(JSON.stringify(target)).listImages || [];
            let resListInfoImage=resUpload.listInfoImage;
            // 添加到listImages
            if(resListInfoImage && resListInfoImage.length>0){
                resListInfoImage.forEach(objImage=>{
                    let isUploaded=listImages.find(v=>(v.url==objImage.url));
                    if(!isUploaded)listImages.push(objImage);        
                })
            }
            let resUpdate=await service.update(ctx, fields._id, {
                listImages: listImages,
                updateDate:Date.now(),
            })
            let resQuery=await service.item(ctx, {
                query: {
                    _id: fields._id
                },
                files:"_id name url listImages updateDate"
            });
            let resFinal={
                path: resUpload.path,
                listPath:resUpload.listPath,
                listInfoImage:resUpload.listObjImage,
                _doc:resQuery._doc
            }
            console.info("updateAlbum.artist.controller:更新图集结果:",resFinal)
            ctx.helper.renderSuccess(ctx,{
                data:resFinal,
            });

        } catch (err) {
            debugger
            ctx.helper.renderFail(ctx, {message: err.message,stack:err.stack});
        }

    }
    // 相册删除payload:_id,url
    async removeAlbum(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let payload = ctx.request.body || {};
        let console=this.logger;

        try {
            if (!payload._id) {
                throw new Error(ctx.__('validate_error_params')+payload._id);
            }
            if (!payload.url) {
                throw new Error(ctx.__('validate_error_params')+payload.url);
            }
            let resFinal={
                status:"fail",
                message:"",
                urlFile:payload.url,
                _id:payload._id,
                // pathFile:"/xxx/xxx/xxx/xxx.jpg",
                _doc:{}
            }
            let resDelete=await ctx.service.uploadFiles.delete(payload);
            resFinal=Object.assign(resFinal,resDelete);
            // res={
            //     status:"fail",
            //     message:"",
            //     data:payload,
            //     urlFile:"http://xxxxxxxxxxxxx",
            //     pathFile:"/xxx/xxx/xxx/xxx.jpg",
            // }
            // 未找到文件或者文件删除成功
            if(resDelete.status=="success" || resDelete.status=="fail:no-exist"){
                //检索最新listImages
                let target = await service.item(ctx, {
                    query: {
                        _id: payload._id
                    },
                    files:"_id name listImages updateDate"
                });
                
                let listImages = JSON.parse(JSON.stringify(target)).listImages || [];
                let idxInList=listImages.findIndex(v=>(v.url==payload.url));
                // 列表里有，则更新
                if(idxInList!=-1){
                    listImages.splice(idxInList,1);
                    let resUpdate=await service.update(ctx, payload._id, {
                        listImages: listImages,
                        updateDate:Date.now(),
                    });
                    let resQuery=await service.item(ctx, {
                        query: {
                            _id: payload._id
                        },
                        files:"_id name listImages updateDate"
                    });
                    resFinal._doc=resQuery._doc;
                    console.info("removeAlbum.artist.controller:更新图集结果:",resFinal)
                    resFinal.message+="=>artist已update=>artist返回最新结果_doc";
                }else{
                    // listImages没有找到对应文件，但文件已删除;
                    resFinal.message+="=>listImages没有找到对应文件，但文件已删除"
                }
                ctx.helper.renderSuccess(ctx,{
                    data:resFinal,
                });
            }else ctx.helper.renderFail(ctx, resFinal);

        } catch (err) {
            debugger
            ctx.helper.renderFail(ctx, {message: err.message,stack:err.stack});
        }
    }
    //更新视频列表;
    async updateVideos(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let fields = ctx.request.body || {};
        let listVideos=fields.listVideos || [];

        try{           
            //网易云音乐listVideos，只有空的情况下会同步？
            // let listVideos=(payload.listVideos.constructor.name === "CoreDocumentArray")?payload.listVideos.toObject():(payload.listVideos || []);
            //去重&合并
            // listVideos=[...new Set(listVideos.concat(ncmlistVideos))]
            listVideos=[...new Set(listVideos)]
            // 去空数据
            listVideos=listVideos.filter(v=>(v));

            let resUpdate=await service.update(ctx, fields._id, {
                listVideos,
                updateDate:Date.now(),
            })
            ctx.helper.renderSuccess(ctx,{
                data: listVideos
            });

        } catch (err) {
            debugger
            ctx.helper.renderFail(ctx, { message: err });
        }
    }

    //更新各种列表;
    // async updateList(list={}){
    //     const {
    //         ctx,
    //         app
    //     } = this;
    //     let service=ctx.service[SERVICE_NAME];
    //     let fields = ctx.request.body || {};
    //     let _id=fields._id;

    //     let objUpdate = {} 
    //     let console=this.logger;

    //     for(let k in fields){
    //         let list=fields[k];
    //         if(list instanceof Array && (k=="listLinks" || k=="listHotMusics" || k=="listVideos" || k=="listImages" || k=="listMembers" || k=="listRefs")){
    //             list= list || [];
    //             //去重
    //             list=[...new Set(list)];
    //             // 去空数据
    //             list=list.filter(v=>(v));
    //             objUpdate[k]=list;
    //         }
    //     }
    //     objUpdate.updateDate=Date.now();

    //     try{
    //         // 具体情况
    //         if(objUpdate.listLinks){
    //             // 是否listLinks有更新，优先取listLinks
    //             let idNCM=ctx.service.artist.findIdInLink(objUpdate.listLinks);

    //             if (!shortid.isValid(_id)) throw new Error(ctx.__('validate_error_params')+_id);
    //             // 跟数据库比较是否一致
    //             let payload=await service.item(ctx,{query:{_id:_id},files:"_id name listLinks idNCM"})
    //             if(ctx.service.artist.isNCM(payload.idNCM) && payload.idNCM!=idNCM)payload.idNCM="";//重置idNCM,后面同步的更新其他网易数据

    //             // 网易云音乐id
    //             payload.idNCM=await ctx.service.artist.checkIdNCM(payload) || "";
    //             objUpdate.idNCM=payload.idNCM;
    //         }

    //         if (!shortid.isValid(_id)) throw new Error(ctx.__('validate_error_params')+_id);
    //         let resUpdate=await service.update(ctx, _id, objUpdate)
    //         ctx.helper.renderSuccess(ctx,{
    //             data: objUpdate
    //         });

    //     } catch (err) {
    //         debugger
    //         console.error(err)
    //         ctx.helper.renderFail(ctx, { message: err });
    //     }
    // }
}

module.exports = APIController;
