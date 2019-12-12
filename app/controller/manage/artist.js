/*
 * @Author: doramart 
 * @Date: 2019-06-20 18:55:40 
 * @Last Modified by: dr
 * @Last Modified time: 2019-12-08 00:38:14
 */
const Controller = require('egg').Controller;

const {
    artist
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
    async list(req, res, next) {
        try {
    
            let payload = req.query;
            let state = req.query.state;
            let userId = req.query.userId;
    
            let queryObj = {};
    
            if (state) {
                queryObj.state = state
            }
            if (userId) {
                queryObj.uAuthor = userId;
            }
    
            let artistList = await this.ctx.service.artist.find(payload, {
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
    
            this.ctx.helper.renderSuccess(req, res, {
                data: artistList
            });
    
        } catch (err) {
    
            this.ctx.helper.renderFail(req, res, {
                message: err
            });
    
        }
    }
    
    async create(req, res, next){
        try {
            let fields = req.body || {};
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
                author: !_.isEmpty(req.session.adminUserInfo) ? req.session.adminUserInfo._id : '',
                isTop: fields.isTop || '',
                discription: xss(fields.discription),
                simpleComments: xss(fields.simpleComments),
                likeUserIds: [],
            }
            let formObj=Object.assign({},funGetData(fields),formObjCheck);
            console.log(fields,formObj)
            let errInfo = validateForm(res, 'artist', formObj);
    
            if (!_.isEmpty(errInfo)) {
                throw new Error(errInfo.errors[0].message)
            }
    
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
    
            await this.ctx.service.artist.create(formObj);
            this.ctx.helper.renderSuccess(req, res);
    
        } catch (err) {
            this.ctx.helper.renderFail(req, res, {
                message: err
            });
        }
    
    }
    
    async getOne (req, res, next) {
        try {
            let _id = req.query.id;
    
            let targetArtist = await this.ctx.service.artist.item(res, {
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
    
            this.ctx.helper.renderSuccess(req, res, {
                data: targetArtist
            });
    
        } catch (err) {
            this.ctx.helper.renderFail(req, res, {
                message: err
            });
        }
    
    }
    
    // 文章推荐
    async updateContentToTop (req, res, next){
        try {
            let fields = req.body || {};
            if (!fields._id) {
                throw new Error(res.__('validate_error_params'));
            }
            await this.ctx.service.artist.update(res, fields._id, {
                isTop: fields.isTop
            })
    
            this.ctx.helper.renderSuccess(req, res);
    
        } catch (err) {
    
            this.ctx.helper.renderFail(req, res, {
                message: err
            });
        }
    }
    
    // 文章置顶
    async roofPlacement (req, res, next) {
    
    
        try {
            let fields = req.body || {};
            await this.ctx.service.artist.update(res, fields._id, {
                roofPlacement: fields.roofPlacement
            })
    
            this.ctx.helper.renderSuccess(req, res);
    
        } catch (err) {
            this.ctx.helper.renderFail(req, res, {
                message: err
            });
        }
    
    }
    
    // 给文章分配用户
    // async redictContentToUsers = async (req, res, next) => {
    
    //     try {
    //         let fields = req.body || {};
    //         let errMsg = '',
    //             targetIds = fields.ids;
    //         let targetUser = fields.targetUser;
    
    //         if (!shortid.isValid(targetUser)) {
    //             errMsg = res.__("validate_error_params");
    //         }
    
    //         if (!checkCurrentId(targetIds)) {
    //             errMsg = res.__("validate_error_params");
    //         } else {
    //             targetIds = targetIds.split(',');
    //         }
    
    //         if (errMsg) {
    //             throw new Error(errMsg);
    //         }
    
    //         await this.ctx.service.artist.updateMany(res, targetIds, {
    //             uAuthor: targetUser
    //         })
    
    //         this.ctx.helper.renderSuccess(req, res);
    
    //     } catch (err) {
    
    //         this.ctx.helper.renderFail(req, res, {
    //             message: err
    //         });
    //     }
    // }
    
    
    async update (req, res, next) {
    
        try {
            let fields = req.body || {};
            const formObjCheck = {
                keywords: fields.keywords ? (fields.keywords).split(',') : [],
                author: !_.isEmpty(req.session.adminUserInfo) ? req.session.adminUserInfo._id : '',
                isTop: fields.isTop || '',
                updateDate: new Date(),
                discription: xss(fields.discription),
                simpleComments: xss(fields.simpleComments),
            }
            let formObj=Object.assign({},funGetData(fields),formObjCheck);
            console.log(fields,formObj)
    
            let errInfo = validateForm(res, 'artist', formObj)
    
            if (!_.isEmpty(errInfo)) {
                throw new Error(errInfo.errors[0].message)
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
            if (req.session.adminUserInfo && fields.targetUser) {
                formObj.uAuthor = fields.targetUser;
            }
    
            await this.ctx.service.artist.update(res, fields._id, formObj);
    
            this.ctx.helper.renderSuccess(req, res);
    
        } catch (err) {
    
            this.ctx.helper.renderFail(req, res, {
                message: err
            });
    
        }
    
    }
    
    
    async removes(req, res, next) {
        try {
            let targetIds = req.query.ids;
    
            if (!checkCurrentId(targetIds)) {
                throw new Error(res.__("validate_error_params"));
            } else {
                await this.ctx.service.messageService.removes(res, targetIds, 'artistId');
            }
    
            await this.ctx.service.artist.removes(res, targetIds);
            this.ctx.helper.renderSuccess(req, res);
    
        } catch (err) {
    
            this.ctx.helper.renderFail(req, res, {
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



