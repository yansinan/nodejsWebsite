const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);
const {
    siteFunc
} = require('../../utils');
const checkRule = (ctx) => {
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


const renderContentTags = async (ctx, fieldTags) => {
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
// 乐队成员有效性
const renderListMembers = async (ctx, fieldTags) => {
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

const funGetData = async (ctx,fields) => {
    //检查标签的有效性
    let newTagArr = await renderContentTags(ctx, fields.tags);
    //TODO 20201213: 检查乐队成员的有效性
    let newListMember= await renderListMembers(ctx,fields.listMembers);
    // console.info('udpate: %j', newTagArr)
    // this.logger.debug('udpate: %j', newTagArr);
    // 友情链接图标
    if(fields.listLinks && fields.listLinks.length > 0 ){
        fields.listLinks.forEach(objLink => {
            if(objLink.icon=="" && objLink.url.indexOf("weibo.com")!=-1)objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
            if(objLink.icon=="" && objLink.url.indexOf("douban.com")!=-1)objLink.icon="/static/themes/images/link/logo_douban_32x32.png"
            if(objLink.icon=="" && objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png"
        });
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
        listMembers:newListMember,//fields.listMembers,
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
        from:fields.from,
        listDateDur:fields.listDateDur,
        listHotMusics:fields.listHotMusics,
        listLinks:fields.listLinks,
        listImages:fields.listImages,
        listVideos:fields.listVideos,
    }
    // 设置创建日期为加入日期
    if(formObj.listDateDur && formObj.listDateDur[0]){
        formObj.date=formObj.listDateDur[0];
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

let ControllerPlugin = {
// const Controller = require('egg').Controller;
// /class ControllerPlugin extends Controller {

    async list(ctx, app) {
        try {
            let service=ctx.service[SERVICE_NAME];

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
    },

    async create(ctx, app) {


        try {
            let service=ctx.service[SERVICE_NAME];

            let fields = ctx.request.body || {};
            // 初始化用户喜欢
            fields.likeUserIds=[];
            let formObj=await funGetData(ctx,fields);//Object.assign({},await funGetData(ctx,fields));
            console.log(fields,formObj)
            //数据有效性 
            ctx.validate(checkRule(ctx), formObj);

            await service.create(formObj);

            ctx.helper.renderSuccess(ctx);
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async getOne(ctx, app) {

        try {
            let service=ctx.service[SERVICE_NAME];

            let _id = ctx.query.id;

            let target = await service.item(ctx, {
                query: {
                    _id: _id
                },
            });

            ctx.helper.renderSuccess(ctx, {
                data: target
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    // 文章推荐
    async updateToTop(ctx, app) {

        try {
            let service=ctx.service[SERVICE_NAME];

            let fields = ctx.request.body || {};
            if (!fields._id) {
                throw new Error(ctx.__('validate_error_params'));
            }
            await service.update(ctx, fields._id, {
                isTop: fields.isTop
            })

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    // 文章置顶
    async roofPlacement(ctx, app) {

        try {
            let service=ctx.service[SERVICE_NAME];

            let fields = ctx.request.body || {};
            await service.update(ctx, fields._id, {
                roofPlacement: fields.roofPlacement
            })

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async update(ctx, app) {

        try {
            let service=ctx.service[SERVICE_NAME];

            let fields = ctx.request.body || {};
            let formObj=await funGetData(ctx,fields);//Object.assign({},await funGetData(ctx,fields));
            //数据有效性
            ctx.validate(checkRule(ctx), formObj);

            await service.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },
    // 相册上传
    async updateAlbum(ctx, app) {

        try {
            let service=ctx.service[SERVICE_NAME];
            // 接收上传文件以及parts.field
            let resUpload=await ctx.service.uploadFiles.create();
            // resUpload={
            //     path: listReturenPath[0],
            //     listPath:listReturenPath,
            //     listInfoImage:listObjImage,
            //     field:ctx.request.body,
            // }
            let fields = resUpload.field || ctx.request.body || {};
            if (!fields._id) {
                throw new Error(ctx.__('validate_error_params'));
            }
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

    },
    // 相册删除payload:_id,url
    async removeAlbum(ctx,app){
        try {
            let service=ctx.service[SERVICE_NAME];
            let payload = ctx.request.body || {};
            if (!payload._id) {
                throw new Error(ctx.__('validate_error_params'));
            }
            if (!payload.url) {
                throw new Error(ctx.__('validate_error_params'));
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
    },
    async removes(ctx, app) {

        try {            
            let service=ctx.service[SERVICE_NAME];

            let targetIds = ctx.query.ids;
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
    },
}

module.exports = ControllerPlugin;
