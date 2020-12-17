const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');

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

    return {
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
    }
}
let ArtistController = {

    async list(ctx, app) {

        try {

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
            let dataList = await ctx.service.artist.find(payload, {
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
            let fields = ctx.request.body || {};

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
    
            const formObjCheck = {
                keywords: targetKeyWords,
                author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
                isTop: fields.isTop || '',
                discription: xss(fields.discription),
                simpleComments: xss(fields.simpleComments),
                likeUserIds: [],
            }
            let formObj=Object.assign({},await funGetData(ctx,fields),formObjCheck);
            console.log(fields,formObj)

            ctx.validate(checkRule(ctx), formObj);

            // 设置显示模式
            let checkInfo = siteFunc.checkContentType(formObj.simpleComments);
            formObj.appShowType = checkInfo.type;
            formObj.imageArr = checkInfo.imgArr;
            formObj.videoArr = checkInfo.videoArr;
            if (checkInfo.type == '3') {
                formObj.videoImg = checkInfo.defaultUrl;
            }
            formObj.simpleComments = siteFunc.renderSimpleContent(formObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);


            // 如果是管理员代发,则指定用户
            if (ctx.session.adminUserInfo && fields.targetUser) {
                formObj.uAuthor = fields.targetUser;
            }

            await ctx.service.artist.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async getOne(ctx, app) {

        try {
            let _id = ctx.query.id;

            let target = await ctx.service.artist.item(ctx, {
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

            let fields = ctx.request.body || {};
            if (!fields._id) {
                throw new Error(ctx.__('validate_error_params'));
            }
            await ctx.service.artist.update(ctx, fields._id, {
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

            let fields = ctx.request.body || {};
            await ctx.service.artist.update(ctx, fields._id, {
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

            let fields = ctx.request.body || {};

            // const formObj = {
            //     title: fields.title,
            //     stitle: fields.stitle,
            //     type: fields.type,
            //     categories: fields.categories,
            //     sortPath: fields.sortPath,
            //     tags: newTagArr,
            //     // keywords: fields.keywords ? (fields.keywords).split(',') : [],
            //     sImg: fields.sImg,
            //     sImgType: fields.sImgType,
            //     cover: fields.cover,
            //     // author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
            //     state: fields.state,
            //     dismissReason: fields.dismissReason,
            //     // isTop: fields.isTop || '',
            //     // updateDate: new Date(),
            //     // discription: xss(fields.discription),
            //     comments: fields.comments,
            //     // simpleComments: xss(fields.simpleComments),
            //     type: fields.type
            // }

            const formObjCheck = {
                keywords: fields.keywords ? (fields.keywords).split(',') : [],
                author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
                isTop: fields.isTop || '',
                updateDate: new Date(),
                discription: xss(fields.discription),
                simpleComments: xss(fields.simpleComments),
            }
            let formObj=Object.assign({},await funGetData(ctx,fields),formObjCheck);

            ctx.validate(checkRule(ctx), formObj);

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

            await ctx.service.artist.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    async removes(ctx, app) {

        try {
            let targetIds = ctx.query.ids;
            // let draft = ctx.query.draft;

            if (!checkCurrentId(targetIds)) {
                throw new Error(ctx.__("validate_error_params"));
            } else {
                // if (draft == '1') {
                //     await ctx.service.artist.safeDelete(ctx, targetIds, {
                //         draft: '1'
                //     });
                // } else {
                //     await ctx.service.message.removes(ctx, targetIds, 'Id');
                //     await ctx.service.artist.removes(ctx, targetIds);
                // }
                // await ctx.service.message.removes(ctx, targetIds, 'contentId');
                await ctx.service.message.removes(ctx, targetIds, 'Id');
                await ctx.service.artist.removes(ctx, targetIds);

            }
            
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    // async updateMulti(ctx, app) {

    //     try {

    //         let fields = ctx.request.body || {};

    //         let targetIds = fields.ids;
    //         let updates = fields.updates;

    //         if (!checkCurrentId(targetIds)) {
    //             throw new Error(ctx.__("validate_error_params"));
    //         } 

    //         await ctx.service.artist.updateMany(ctx, targetIds, updates);

    //         ctx.helper.renderSuccess(ctx);

    //     } catch (err) {

    //         ctx.helper.renderFail(ctx, {
    //             message: err
    //         });
    //     }
    // }


}

module.exports = ArtistController;