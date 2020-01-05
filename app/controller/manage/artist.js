/*
 * @Author: doramart 
 * @Date: 2019-06-20 18:55:40 
 * @Last Modified by: dr
 * @Last Modified time: 2019-12-08 00:38:14
 */
const Controller = require('egg').Controller;

const {
    artistRule
} = require('@validate')


// const DataOptionLog = require("./dataOptionLog");
const _ = require('lodash');
const {
    siteFunc
} = require('@utils');
const xss = require("xss");

// const schedule = require('node-schedule');
function funGetData(fields){
    return {
        name: fields.name,
        alias: fields.alias,
        listMembers:fields.listMembers,
        // stitle: fields.stitle,
        type: fields.type,
        categories: fields.categories,
        sortPath: fields.sortPath,
        tags: fields.tags,
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

class ArtistController extends Controller {
    async list(ctx, app) {
        try {
    
            // let payload = req.query;
            // let state = req.query.state;
            // let userId = req.query.userId;
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
    
            let artistList = await ctx.service.artist.find(payload, {
                query: queryObj,
                searchKeys: ['userName', 'title', 'comments', 'discription'],
                // populate: [{
                //         path: 'author',
                //         select: 'userName name logo _id group'
                //     },
                //     {
                //         path: 'uAuthor',
                //         select: 'userName name logo _id group',
                //         $match: {
                //             group: '1'
                //         }
                //     },
                //     {
                //         path: 'categories',
                //         select: 'name _id defaultUrl'
                //     }, {
                //         path: 'tags',
                //         select: 'name _id'
                //     }
                // ]
    
            });    
            ctx.helper.renderSuccess(ctx, {
                data: artistList
            });
    
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
    
        }
    }
    
    async create(ctx, app){
        try {
            // let fields = req.body || {};
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
            let formObj=Object.assign({},funGetData(fields),formObjCheck);
            console.log(fields,formObj)
            // let errInfo = validateForm(res, 'artist', formObj);

            // if (!_.isEmpty(errInfo)) {
            //     throw new Error(errInfo.errors[0].message)
            // }
            ctx.validate(artistRule(ctx), formObj);;

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
            // if (req.session.adminUserInfo && fields.targetUser) {
            //     formObj.uAuthor = fields.targetUser;
            // }
    
            await ctx.service.artist.create(formObj);
            ctx.helper.renderSuccess(ctx);    
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }    
    }    
    async getOne (ctx, app) {
        try {
            let _id = ctx.query.id;
            let targetArtist = await ctx.service.artist.item(ctx, {
                query: {
                    _id: _id
                },
                // populate: [{
                //         path: 'author',
                //         select: 'userName name logo _id group'
                //     },
                //     {
                //         path: 'uAuthor',
                //         select: 'userName name logo _id group',
                //         $match: {
                //             group: '1'
                //         }
                //     },
                //     {
                //         path: 'categories',
                //         select: 'name _id defaultUrl'
                //     }, {
                //         path: 'tags',
                //         select: 'name _id'
                //     }
                // ]
            });    
            ctx.helper.renderSuccess(ctx, {
                data: targetArtist
            });    
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    
    }
    
    // 文章推荐
    async updateContentToTop (ctx, app){
        try {
            let fields = ctx.request.body || {};

            if (!fields._id) {
                throw new Error(ctx.__('validate_error_params'));
            }
            await this.ctx.service.artist.update(ctx, fields._id, {
                isTop: fields.isTop
            })    
            ctx.helper.renderSuccess(ctx);    
        } catch (err) {    
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }
    
    // 文章置顶
    async roofPlacement (ctx, app) {   
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
    } 

    async update () {
        const {
            ctx,
            service
        } = this;
        try {
            // let fields = req.body || {};
            console.info('udpate.ctx.request: %j', ctx.request)
            this.logger.debug('udpate.ctx.request: %j', ctx.request);
            let fields = ctx.request.body || {};

            const formObjCheck = {
                keywords: fields.keywords ? (fields.keywords).split(',') : [],
                author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
                isTop: fields.isTop || '',
                updateDate: new Date(),
                discription: xss(fields.discription),
                simpleComments: xss(fields.simpleComments),
            }
            let formObj=Object.assign({},funGetData(fields),formObjCheck);
            // console.log(fields,formObj)
    
            // let errInfo = validateForm(res, 'artist', formObj)
    
            // if (!_.isEmpty(errInfo)) {
            //     throw new Error(errInfo.errors[0].message)
            // }
            ctx.validate(artistRule(ctx), formObj);

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
    
            // await this.ctx.service.artist.update(res, fields._id, formObj);
            await ctx.service.artist.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);
    
        } catch (err) {
            console.error("updateArtist:error",err)
            ctx.helper.renderFail(ctx, {
                message: err
            });
    
        }
    
    }
    
    
    async removes(ctx, app) {
        try {
            let targetIds = ctx.query.ids;
    
            if (!checkCurrentId(targetIds)) {
                throw new Error(ctx.__("validate_error_params"));
            } else {
                await ctx.service.message.removes(ctx, targetIds, 'contentId');
            }
    
            await ctx.service.artist.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);
    
        } catch (err) {
    
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }
}
module.exports = ArtistController;
// const {
//     artistService,
//     messageService
// } = require('@service');





// const _ = require('lodash');
// const shortid = require('shortid');



