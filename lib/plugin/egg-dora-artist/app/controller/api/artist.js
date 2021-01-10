const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');
const {
    siteFunc,
    validatorUtil
} = require('../../utils');
const validator = require('validator');
const fs = require('fs');
const path = require('path');

const awaitStreamReady = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const mammoth = require("mammoth");
const moment = require("moment");

const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);

let ControllerPlugin = {
    // 时间线：// 获取时间线:演出，唱片，新闻，视频，加入
    async getListTimeline(ctx,inArtist){
        let targetId=inArtist._id;
        try {

            let listRecords=(await ctx.service.record.find(ctx.query, {
                sort: {dateRelease: -1},
                query: {state: '2',listArtists:targetId},
                searchKeys: ['sImg', 'name', 'dateRelease', 'listFormatTags'],
                files: "sImg name dateRelease url dateTimeline"
            })).docs;
            
            let listContent=(await ctx.service.content.find(ctx.query, {
                sort: {date: -1},
                query: {state: '2',tags:targetId},
                searchKeys: ['sImg', 'title', 'date'],
                files: "sImg title date url"
            })).docs;
            let listShow=(await ctx.service.show.find(ctx.query, {
                sort: {dateStart: -1},
                query: {state: '2',listArtists:targetId},
                searchKeys: ['sImg', 'title', 'dateStart'],
                files: "sImg name title listDateDur dateStart url "
            })).docs;
            // 合并
            let listTimeline=[...listRecords,...listContent || [],...listShow || []];
            listTimeline.push({
                name:"加入赤瞳",
                dateTimeline:inArtist.dateStart,
                url:inArtist.url,
            })
            // 排序
            listTimeline=listTimeline.sort((a,b)=>{
                let timeA=new Date(a.dateTimeline || a.dateRelease || a.dateStart || a.date);
                let timeB=new Date(b.dateTimeline || b.dateRelease || b.dateStart || b.date);
                return timeB.getTime()-timeA.getTime();
            })
            
            return listTimeline.map(v=>{
                let source=v.url.split("/")[1];//artist,show,record,detail
                let strDefault=source == "record"?"发布：":"";
                return {
                    name: strDefault + ( v.sTitle || v.alias || v.title || v.name),
                    dateTimeline: moment(new Date(v.dateTimeline || v.dateRelease || v.dateStart || v.date)).format("MM-DD"),
                    dateYear:moment(new Date(v.dateTimeline || v.dateRelease || v.dateStart || v.date)).format("YYYY"),
                    url:v.url,
                }
            })
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
            debugger
        }
    },
    // 字段列表：
    getListFields (type = '') {

        let files = null;
        if (type == 'normal') {
            files = '_id url name alias sImg date updateDate discription clickNum roofPlacement type videoImg state dismissReason categories isTop'
        } else if (type == 'simple') {
            files = '_id url name alias sImg stitle date updateDate clickNum roofPlacement type videoImg state dismissReason';
        } else if (type == 'stage1') {
            files = '_id url name alias sImg date updateDate discription comments clickNum roofPlacement type videoImg state dismissReason categories isTop'
        } else if (type == 'list') {
            files = '_id url name alias sImg date discription roofPlacement type state isTop listDateDur dateStart dateYear'
        } else if (type == 'navAvatar') {
            files = '_id url name alias sImg roofPlacement isTop '
        } else {
            files = '_id url name alias sImg date discription clickNum roofPlacement type appShowType imageArr videoArr duration simpleComments comments videoImg state dismissReason categories isTop from listHotMusics listLinks listMembers listDateDur dateStart dateEnd dateYear'
        }
        // console.log('--files----', files)
        return files;
    },

    renderList(ctx, userId = "", inList = []) {

        return new Promise(async (resolve, reject) => {
            try {

                let newContentList = JSON.parse(JSON.stringify(inList));
                let userInfo;

                if (userId) {
                    userInfo = await ctx.service.user.item(ctx, {
                        query: {
                            _id: userId
                        },
                        files: getAuthUserFields('session')
                    })
                }

                for (let contentItem of newContentList) {
                    contentItem.id = contentItem._id;
                    contentItem.hasPraised = false;
                    contentItem.hasComment = false;
                    contentItem.hasFavorite = false;
                    contentItem.hasDespise = false;
                    contentItem.uAuthor && (contentItem.uAuthor.had_followed = false);

                    if (!_.isEmpty(userInfo)) {
                        // 本人是否已点赞
                        if (userInfo.praiseContents && userInfo.praiseContents.indexOf(contentItem._id) >= 0) {
                            contentItem.hasPraised = true;
                        }
                        // 本人是否已收藏
                        if (userInfo.favorites && userInfo.favorites.indexOf(contentItem._id) >= 0) {
                            contentItem.hasFavorite = true;
                        }
                        // 本人是否已踩
                        if (userInfo.despises && userInfo.despises.indexOf(contentItem._id) >= 0) {
                            contentItem.hasDespise = true;
                        }
                        // 本人是否已留言
                        let contentMessage = await ctx.service.message.item(ctx, {
                            query: {
                                contentId: contentItem._id,
                                author: userInfo._id
                            }
                        })
                        if (!_.isEmpty(contentMessage)) {
                            contentItem.hasComment = true;
                        }
                        // 本人是否已关注作者
                        if (userInfo.watchers.length > 0 && contentItem.uAuthor && userInfo.watchers.indexOf(contentItem.uAuthor._id) >= 0) {
                            contentItem.uAuthor.had_followed = true;
                        }
                    }

                    // 留言总数
                    let commentNum = await ctx.service.message.count({
                        contentId: contentItem._id
                    });
                    contentItem.commentNum = commentNum;

                    // 点赞总数
                    let likeNum = await ctx.service.user.count({
                        praiseContents: contentItem._id
                    })
                    contentItem.likeNum = likeNum;

                    // 收藏总数
                    let favoriteNum = await ctx.service.user.count({
                        favorites: contentItem._id
                    })
                    contentItem.favoriteNum = favoriteNum;

                    // 踩帖总数
                    let despiseNum = await ctx.service.user.count({
                        despises: contentItem._id
                    });
                    contentItem.despiseNum = despiseNum;

                    if (contentItem.simpleComments) {
                        contentItem.simpleComments = JSON.parse(contentItem.simpleComments);
                    }

                    // 处理用户敏感信息
                    contentItem.uAuthor && siteFunc.clearUserSensitiveInformation(contentItem.uAuthor);

                }

                resolve(newContentList);
            } catch (error) {
                console.error(SERVICE_NAME,".renderList",error)
                debugger;

                resolve([]);
            }
        })

    },

    async getEnableCateList(ctx, isSingerPage) {

        try {
            const enableCates = await ctx.service.contentCategory.find({
                isPaging: '0'
            }, {
                query: {
                    enable: true,
                    type: isSingerPage ? '2' : '1'
                },
                files: 'id'
            })

            let queryCate = enableCates.map((item, index) => {
                const reg = new RegExp(item.id, 'i')
                // return {
                //     categories: {
                //         $regex: reg
                //     }
                // }
                return item.id;
            })
            return queryCate;

        } catch (error) {
            return []
        }
    },

    /**
     * @api {get} /api/xxxx/getList 查询帖子列表
     * @apiDescription 根据参数获取对应的帖子列表,默认按时间查询，可作为发现栏目列表
     * @apiName /xxxx/getList
     * @apiGroup xxxx
     * @apiParam {string} current 当前页码
     * @apiParam {string} pageSize 每页记录数
     * @apiParam {string} searchkey 搜索关键字
     * @apiParam {string} userId 指定作者ID
     * @apiParam {string} model (1:推荐帖子)
     * @apiParam {string} sortby 按字段排序(0:默认按时间，1:热门)
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *   "status": 200,
     *   "message": "xxxxlist",
     *   "server_time": 1542380520270,
     *   "data": [
     *       {
     *           "_id": "Y1XFYKL52",
     *           "title": "如何优化vue的内存占用？",
     *           "stitle": "如何优化vue的内存占用？",
     *           "sortPath": "",
     *           "keywords": "",
     *           "author": {
     *               "_id": "4JiWCMhzg",
     *               "userName": "doramart",
     *               "name": "生哥",
     *               "logo": "/upload/smallimgs/img1448202744000.jpg"
     *           },
     *           "discription": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后",
     *           "comments": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后，感觉相比于传统的jquery（zepto）和前端模板引擎的组合能有效的提升开发效率和代码维护性，但是也存在一些问题，比如说内存占用问题，用vue.js开发的页面内存占用相比于传统方式会更多，而且传统的开发方式页面渲染完后，还能对不需要的js对象进行垃圾回收，但vue.js里面的一些指令对象、watcher对象、data数据等似乎目前都没有找到比较好的垃圾回收的方式。想问下对于那些只用渲染一次的页面部分（比如数据量较大的列表页）有没有比较合适的内存优化方案（比如释放指令对象、watcher对象、data对象）？举个例子：比如其中的lazy指令，以及对于items这个基本上只用渲染一次的data等有没有可以优化内存占用的方法",
     *           "translate": "",
     *           "bearish": [],
     *           "profitable": [],
     *           "from": "1",
     *           "likeUserIds": [],
     *           "likeNum": 0, // 点赞总数
     *           "commentNum": 0, // 留言总数
     *           "favoriteNum": 0, // 收藏总数
     *           "despiseNum": 0, // 踩帖总数
     *           "clickNum": 1,
     *           "isTop": 0,
     *           "state": true,
     *           "updateDate": "2018-11-16",
     *           "date": "2018-11-16 23:00:16",
     *           "appShowType": "0", // app端展示模式 0，1，2，3
     *           "duration": "0:01",, // 针对视频的视频时长
     *           "sImg": "/upload/images/img20181116225948.jpeg",
     *           "tags": [
     *               {
     *                "_id": "Y3DTgmHK3",
     *                "name": "区块链",
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Y3DTgmHK3"
     *                }
     *            ],
     *           "categories": [
     *                {
     *                "_id": "Nycd05pP",
     *                "name": "人工智能",
     *                "defaultUrl": "artificial-intelligence",
     *                "enable": true,
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Nycd05pP"
     *                }
     *            ],
     *           "type": "1",
     *           "id": "Y1XFYKL52"
     *           "hasPraised": false // 当前用户是否已赞�
     *           "hasReworded": false // 当前用户是否已打赏�
     *           "hasComment": false // 当前用户是否已评论
     *           "hasFavorite": false // 当前用户是否已收藏
     *           "hasDespise": false // 当前用户是否已踩
     *           "total_reward_num": 0  // 打赏总额
     *        }
     *    ]
     *}
     * @apiSampleRequest http://localhost:8080/api/xxxx/getList
     * @apiVersion 1.0.0
     */

     async list(ctx, app) {

        try {

            let payload = ctx.query;
            let userId = ctx.query.userId;
            let userInfo = ctx.session.user || {};
            let model = ctx.query.model;
            let sortby = ctx.query.sortby;
            let listState = ctx.query.listState || '2';
            let typeId = ctx.query.typeId;
            let tagName = ctx.query.tagName;
            let filesType = ctx.query.filesType || 'list'; // 查询模式 full/normal/simple
            let isSingerPage = false; // 是否是单页面

            let service=ctx.service[SERVICE_NAME];

            let queryObj = {
                    state: '2'
                },
                sortObj = {
                    date: -1
                };


            if (ctx.query.pageType == 'index') {
                sortObj = {
                    roofPlacement: -1,
                    date: -1
                };
            }

            if (model == '1') {
                queryObj.isTop = 1;
            }

            if (tagName) {
                let targetTag = await ctx.service.contentTag.item(ctx, {
                    query: {
                        name: tagName
                    }
                });
                if (!_.isEmpty(targetTag)) {
                    queryObj.tags = targetTag._id;
                    delete queryObj.categories;
                }
            }


            if (sortby == '1') { // 按点击量排序
                delete sortObj.date;
                delete sortObj.roofPlacement;
                sortObj = {
                    clickNum: 1
                }
                let rangeTime = getDateStr(-720);
                queryObj.date = {
                    "$gte": new Date(rangeTime.startTime),
                    "$lte": new Date(rangeTime.endTime)
                }
            }

            // 如果是本人，返回所有文档
            if (!_.isEmpty(userInfo) && userInfo._id == userId) {
                queryObj.uAuthor = userInfo._id;
                if (listState == 'all') {
                    delete queryObj.state;
                } else {
                    if (listState == '0' || listState == '1' || listState == '2') {
                        queryObj.state = listState;
                    }
                }
            } else {
                userId && (queryObj.uAuthor = userId);
            }

            // if (typeId) {
            //     queryObj.categories = typeId
            //     _.assign(queryObj, {
            //         categories: typeId
            //     });
            //     // 针对顶级分类下挂载的文章
            //     let singerCate = await ctx.service.contentCategory.count({
            //         _id: typeId,
            //         enable: true,
            //         type: '2'
            //     });
            //     if (singerCate > 0) {
            //         filesType = 'stage1';
            //         isSingerPage = true;
            //         let ableCateList = await this.getEnableCateList(ctx, isSingerPage);
            //         if (ableCateList.indexOf(typeId) < 0) {
            //             _.assign(queryObj, {
            //                 categories: {
            //                     $in: ableCateList
            //                 }
            //             });
            //         }

            //     }
            // } else {
            //     // 只查询可见分类的文章
            //     let ableCateList = await this.getEnableCateList(ctx, false);
            //     _.assign(queryObj, {
            //         categories: {
            //             $in: ableCateList
            //         }
            //     });
            // }

            let listRes = await service.find(payload, {
                sort: sortObj,
                query: queryObj,
                searchKeys: ['userName', 'name', 'comments', 'discription'],
                files: this.getListFields(filesType)
            });

            listRes.docs = await this.renderList(ctx, userInfo._id, listRes.docs);
            ctx.helper.renderSuccess(ctx, {
                data: listRes
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async getTopIndexContents(ctx, app) {

        try {
            let current = ctx.query.current || 1;
            let pageSize = ctx.query.pageSize || 10;
            let model = ctx.query.model || 'normal'; // 查询模式 full/normal/simple
            let userInfo = ctx.session.user || {};
            let payload = ctx.query;

            let service=ctx.service[SERVICE_NAME];


            // 条件配置
            let queryObj = {
                state: '2',
                isTop: 1,
                uAuthor: {
                    $ne: null
                }
            };

            let sortObj = {
                roofPlacement: -1
            };

            let recContents = [];

            if (!_.isEmpty(userInfo) && !_.isEmpty(userInfo.watchTags) && userInfo.watchTags.length > 0) {
                // 查询置顶文章
                let tagQuery = {
                    state: '2',
                    $or: [{
                        roofPlacement: 1
                    }, {
                        tags: {
                            $in: userInfo.watchTags
                        }
                    }]
                };

                let recContentsNum = await service.count(tagQuery);
                recContents = await service.find(payload, {
                    query: tagQuery,
                    files: this.getListFields(),
                    sort: sortObj
                })

                if (recContentsNum > current * pageSize) {
                    recContents.docs = await this.renderList(ctx, userInfo._id, recContents.docs);
                    ctx.helper.renderSuccess(ctx, {
                        data: recContents
                    });
                } else {

                    let leftNormalSize = current * pageSize - recContentsNum;
                    if (leftNormalSize <= pageSize) {

                        if (leftNormalSize > 0) {
                            let leftContents = await service.find({
                                current: 1,
                                pageSize: Number(leftNormalSize)
                            }, {
                                query: {
                                    state: '2',
                                    tags: {
                                        $nin: userInfo.watchTags
                                    }
                                },
                                files: this.getListFields(),
                                sort: sortObj
                            })
                            recContents = _.concat(recContents, leftContents);
                        }

                    } else {

                        let leftContents = await service.find({
                            skip: leftNormalSize,
                            pageSize: Number(pageSize)
                        }, {
                            query: {
                                state: '2',
                                tags: {
                                    $nin: userInfo.watchTags
                                }
                            },
                            files: this.getListFields(),
                            sort: sortObj
                        })
                        recContents = _.concat(recContents, leftContents);
                    }

                    recContents.docs = await renderList(ctx, userInfo._id, recContents.docs);

                    ctx.helper.renderSuccess(ctx, {
                        data: recContents
                    });

                }

            } else {
                let contents = await service.find(payload, {
                    query: queryObj,
                    files: this.getListFields(),
                    sort: sortObj
                })
                contents.docs = await this.renderList(ctx, userInfo._id, contents.docs);

                ctx.helper.renderSuccess(ctx, {
                    data: contents
                });
            }

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    /**
     * @api {get} /api/xxxx/getRadom 获取随机文档列表
     * @apiDescription 获取随机文档列表 不分页
     * @apiName /xxxx/getRadomContents
     * @apiGroup Xxxxx
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *   "status": 200,
     *   "message": "xxxxlist",
     *   "server_time": 1542380520270,
     *   "data": [
     *       {
     *           "_id": "Y1XFYKL52",
     *           "title": "如何优化vue的内存占用？",
     *           "stitle": "如何优化vue的内存占用？",
     *           "sortPath": "",
     *           "keywords": "",
     *           "author": {
     *               "_id": "4JiWCMhzg",
     *               "userName": "doramart",
     *               "name": "生哥",
     *               "logo": "/upload/smallimgs/img1448202744000.jpg"
     *           },
     *           "discription": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后",
     *           "comments": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后，感觉相比于传统的jquery（zepto）和前端模板引擎的组合能有效的提升开发效率和代码维护性，但是也存在一些问题，比如说内存占用问题，用vue.js开发的页面内存占用相比于传统方式会更多，而且传统的开发方式页面渲染完后，还能对不需要的js对象进行垃圾回收，但vue.js里面的一些指令对象、watcher对象、data数据等似乎目前都没有找到比较好的垃圾回收的方式。想问下对于那些只用渲染一次的页面部分（比如数据量较大的列表页）有没有比较合适的内存优化方案（比如释放指令对象、watcher对象、data对象）？举个例子：比如其中的lazy指令，以及对于items这个基本上只用渲染一次的data等有没有可以优化内存占用的方法",
     *           "translate": "",
     *           "bearish": [],
     *           "profitable": [],
     *           "from": "1",
     *           "likeUserIds": [],
     *           "likeNum": 0, // 点赞总数
     *           "commentNum": 0, // 留言总数
     *           "favoriteNum": 0, // 收藏总数
     *           "despiseNum": 0, // 踩帖总数
     *           "clickNum": 1,
     *           "isTop": 0,
     *           "state": true,
     *           "updateDate": "2018-11-16",
     *           "date": "2018-11-16 23:00:16",
     *           "appShowType": "0", // app端展示模式 0，1，2，3
     *           "duration": "0:01",, // 针对视频的视频时长
     *           "sImg": "/upload/images/img20181116225948.jpeg",
     *           "tags": [
     *               {
     *                "_id": "Y3DTgmHK3",
     *                "name": "区块链",
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Y3DTgmHK3"
     *                }
     *            ],
     *           "categories": [
     *                {
     *                "_id": "Nycd05pP",
     *                "name": "人工智能",
     *                "defaultUrl": "artificial-intelligence",
     *                "enable": true,
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Nycd05pP"
     *                }
     *            ],
     *           "type": "1",
     *           "id": "Y1XFYKL52"
     *           "hasPraised": false // 当前用户是否已赞�
     *           "hasReworded": false // 当前用户是否已打赏�
     *           "hasComment": false // 当前用户是否已评论
     *           "hasFavorite": false // 当前用户是否已收藏
     *           "hasDespise": false // 当前用户是否已踩
     *           "total_reward_num": 0  // 打赏总额
     *        }
     *    ]
     *}
     * @apiSampleRequest http://localhost:8080/api/xxxx/getRadom
     * @apiVersion 1.0.0
     */
    async getRadom(ctx, app) {

        let payload = ctx.query;

        let queryObj = {
            type: '1',
            state: '2'
        };
        let randomArticles = [];

        let service=ctx.service[SERVICE_NAME];


        try {
            // 只查询可见分类的文章
            let ableCateList = await this.getEnableCateList(ctx, false);

            _.assign(queryObj, {
                categories: {
                    $in: ableCateList
                }
            });

            const totalContents = await service.count(queryObj);

            randomArticles = await service.find(_.assign(payload, {
                skip: Math.floor(totalContents * Math.random())
            }), {
                query: queryObj,
                files: 'stitle sImg title'
            })

            ctx.helper.renderSuccess(ctx, {
                data: randomArticles
            });
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },



    /**
     * @api {get} /api/content/getContent 查询帖子详情
     * @apiDescription 查询帖子详情(只普通帖子或专题)
     * @apiName /api/content/getContent
     * @apiGroup Content
     * @apiParam {string} id 帖子Id
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     * {
     *  "status": 200,
     *  "message": "content",
     *  "server_time": 1545154926558,
     *  "data": {
     *     "_id": "ri5WaXugX",
     *     "title": "谷歌AI首席科学家：想当研究科学家，一事无成你受得了吗？",
     *     "stitle": "谷歌AI首席科学家：想当研究科学家，一事无成你受得了吗？",
     *     "sortPath": "",
     *     "keywords": "",
     *     "uAuthor": {
     *        "_id": "uUKsBv5y_",
     *        "userName": "creator10",
     *        "logo": "https://cg2010studio.files.wordpress.com/2015/12/cartoonavatar2.jpg",
     *        "date": "2018-12-19 01:42:06",
     *        "id": "uUKsBv5y_"
     *     },
     *     "discription": "AI研究科学家不是那么好当的！近日谷歌AI首席科学家Vincent Vanhoucke发表在Medium上的文章引来众人关注。在本文中，他列举了成为研究科学家所要面对的9大挑战，看完这篇内容或许可以在立志投身于科学事业前，给你先“泼一盆冷水”。",
     *     "__v": 0,
     *     "author": {
     *        "userName": "doramart",
     *        "name": "超管",
     *        "logo": "/upload/smallimgs/img1448202744000.jpg"
     *     },
     *     "simpleComments": [
     *       {
     *        "type": "contents",
     *        "content": "做一名研究人员可能会让你的人生非常充实并得到他人的认可。但我知道很多学生在做研究时受到前景的压力，一时陷入工程的舒适区。他们通常把这个阶段视为个人失败，觉得自己“不够优秀”。而根据我个人的经验，这从来就不是个人价值或者天赋的问题：在研究中成长需要某种不同的气质，这种气质往往与工程师成长的原因有些矛盾。以下是我见过的研究人员在职业生涯的某个阶段不得不面对的一些主要压力：\n  \n做研究要解决的是有多个答案（或没有答案）的不适定问题\n                               *        "
     *       },
     *       {
     *        "type": "video",
     *        "content": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1071402816293179392.mp4"
     *       },
     *       {
     *        "type": "contents",
     *        "content": " \n\n大学教育很大程度上教会了你如何用特定的方案解决适定问题，但用这种方式去对待研究却注定失败。你在研究中做的很多事并不会让你接近答案，而是让你更好地理解问题。 \n"
     *       },
     *       {
     *        "type": "image",
     *        "content": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1075054319700676608.png"
     *       },
     *       {
     *        "type": "contents",
     *        "content": " \n用学到的东西，而不是取得的研究进展来衡量自己的进步，是一个人在研究环境中必须经历的重要范式转变之一。\n\n"
     *       }
     *     ],
     *     "likeNum": 0,
     *     "commentNum": 10,
     *     "clickNum": 77,
     *     "isTop": 1,
     *     "state": true,
     *     "updateDate": "2018-12-08 21:37:38",
     *     "date": "2018-12-08 21:37:38",
     *     "duration": "0:01",
     *     "videoArr": [
     *        "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1071402816293179392.mp4"
     *     ],
     *     "imageArr": [
     *        "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1075054319700676608.png"
     *     ],
     *     "appShowType": "3",
     *     "videoImg": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1071402816293179392_thumbnail.jpg", // 视频缩略图（当appShowType=3）
     *     "sImg": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/img1544276235259.jpg",
     *     "tags": [
     *       {
     *        "_id": "aGE-YfyLRjx",
     *        "name": "化学",
     *        "date": "2018-12-19 01:42:06",
     *        "id": "aGE-YfyLRjx"
     *       },
     *       {
     *        "_id": "_euYIiOqvLA",
     *        "name": "体育",
     *        "date": "2018-12-19 01:42:06",
     *        "id": "_euYIiOqvLA"
     *       }
     *     ],
     *     "categories": [
     *       
     *     ],
     *     "type": "1",
     *     "id": "ri5WaXugX",
     *     "hasPraised": false,
     *     "hasReworded": false,
     *     "hasComment": true,
     *     "hasFavorite": false,
     *     "hasDespise": false,
     *     "total_reward_num": 0,
     *     "favoriteNum": 0,
     *     "despiseNum": 0
     *   }
     * }
     * @apiSampleRequest http://localhost:8080/api/content/getContent
     * @apiVersion 1.0.0
     */
    async getOne(ctx, app) {

        try {
            let targetId = ctx.query.id;
            let userId = ctx.query.userId;

            let service=ctx.service[SERVICE_NAME];


            if (!shortid.isValid(targetId)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let queryObj = {
                _id: targetId,
                state: '2',
                //uAuthor: {
                //    $ne: null
                //}
            };

            let userInfo = ctx.session.user || {};

            await service.inc(ctx, targetId, {
                'clickNum': 1
            })
            let targetContent = await service.item(ctx, {
                query: queryObj,
                files: this.getListFields(),//'_id name alias sImg from listMembers discription clickNum roofPlacement type appShowType imageArr videoArr duration simpleComments comments videoImg state dismissReason isTop',//
            });
            
            let renderContent = Array(targetContent);
            renderContent = await this.renderList(ctx, userInfo._id, renderContent);
            // 获取唱片
            // ctx.query.idArtist=targetId;
            renderContent[0].objDocsRecords=await ctx.service.record.find(ctx.query, {
                sort: {dateRelease: -1},
                query: {state: '2',listArtists:targetId},
                searchKeys: ['sImg', 'name', 'dateRelease', 'listFormatTags'],
                files: "sImg name listFormatTags date"
            });
            // 获取时间线:演出，唱片，新闻，视频，加入
            renderContent[0].listTimeline= await this.getListTimeline(ctx,renderContent[0]);

            ctx.helper.renderSuccess(ctx, {
                data: renderContent[0]
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    /**
     * @api {get} /api/xxxx/getNearbyContent 获取当前文档的上一篇和下一篇
     * @apiDescription 获取随机文档列表 不分页
     * @apiName /content/getNearbyContent
     * @apiParam {string} id 帖子Id
     * @apiGroup xxxxx
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *  "status": 200,
     *  "data": {
     *      "preContent": {
     *          "categories": [
     *               {
     *                   "enable": true,
     *                   "defaultUrl": "document",
     *                   "_id": "Ek7skiaw",
     *                   "name": "DoraCMS",
     *                   "contentTemp": null,
     *                   "id": "Ek7skiaw"
                        },
     *               {
     *                   "enable": true,
     *                   "defaultUrl": "document/course",
     *                   "_id": "EJFzljaw",
     *                   "name": "原创教程",
     *                   "contentTemp": null,
     *                   "id": "EJFzljaw"
     *              }
     *          ],
     *          "tags": [
     *               {
     *                   "_id": "N1OYhcvpg",
     *                   "name": "版本更新",
     *                   "id": "N1OYhcvpg"
     *              },
     *               {
     *                   "_id": "4JZjY1Ru",
     *                   "name": "DoraCMS",
     *                   "id": "4JZjY1Ru"
     *              }
     *          ],
     *          "sImg": "/static/upload/images/1571243055075.jpeg",
     *          "_id": "FDIy_dWl",
     *          "title": "DoraCMS 插件化探索（一）",
     *          "author": {
     *              "logo": "/static/upload/smallimgs/img1448202744000.jpg",
     *              "_id": "4JiWCMhzg",
     *              "userName": "doramart"
     *          },
     *          "discription": "DoraCMS 从今年年初的时候开始有插件化构想，为什么会有这种想法？其实就目前发布的DoraCMS 2.1.3 来讲，对比之前的版本有很多优化，最重要的一点是建立了比较清晰的代码结构",
     *          "uAuthor": {
     *              "logo": "/static/upload/smallimgs/img1447739082000.jpg",
     *              "group": "0",
     *              "_id": "41oT6sQXl",
     *              "userName": "doramart",
     *              "name": "生哥",
     *              "id": "41oT6sQXl"
     *          },
     *          "updateDate": "2019-10-17 00:28:05",
     *          "id": "FDIy_dWl"
     *      },
     *      "nextContent": []
     *   },
     *  "message": ""
     *}
     * @apiSampleRequest http://localhost:8080/api/content/getNearbyContent
     * @apiVersion 1.0.0
     */
    async getNearby(ctx, app) {

        try {
            let contentId = ctx.query.id;

            let service=ctx.service[SERVICE_NAME];


            if (!contentId || !shortid.isValid(contentId)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let targetContent = await service.item(ctx, {
                query: {
                    _id: contentId
                },
                files: 'title _id id data updateDate'
            });

            if (_.isEmpty(targetContent)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let preContent = await service.find({
                isPaging: '0',
                pageSize: 1
            }, {
                query: {
                    _id: {
                        '$ne': targetContent._id
                    },
                    state: '2',
                    updateDate: {
                        "$lte": new Date(targetContent.updateDate)
                    }
                },
                files: 'title _id id data updateDate sImg discription'
            });

            let nextContent = await service.find({
                isPaging: '0',
                // pageSize: 1
            }, {
                query: {
                    _id: {
                        '$ne': targetContent._id
                    },
                    state: '2',
                    updateDate: {
                        "$gte": new Date(targetContent.updateDate)
                    }
                },
                sort: {
                    updateDate: 1
                },
                files: 'title _id id data updateDate sImg discription'
            });

            ctx.helper.renderSuccess(ctx, {
                data: {
                    preContent: !_.isEmpty(preContent) ? preContent[0] : [],
                    nextContent: !_.isEmpty(nextContent) ? nextContent[0] : []
                }
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    /**
     * @api {get} /api/xxxx/getMyFavoriteContents 获取我收藏的帖子列表
     * @apiDescription 获取我收藏的帖子列表 带分页
     * @apiName /xxxx/getMyFavoriteContents
     * @apiGroup Content
     * @apiParam {string} current 当前页码
     * @apiParam {string} pageSize 每页记录数
     * @apiParam {string} token 登录时返回的参数鉴权
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *   "status": 200,
     *   "message": "contentlist",
     *   "server_time": 1542380520270,
     *   "data": [
     *       {
     *           "_id": "Y1XFYKL52",
     *           "title": "如何优化vue的内存占用？",
     *           "stitle": "如何优化vue的内存占用？",
     *           "sortPath": "",
     *           "keywords": "",
     *           "author": {
     *               "_id": "4JiWCMhzg",
     *               "userName": "doramart",
     *               "name": "生哥",
     *               "logo": "/upload/smallimgs/img1448202744000.jpg"
     *           },
     *           "discription": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后",
     *           "comments": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后，感觉相比于传统的jquery（zepto）和前端模板引擎的组合能有效的提升开发效率和代码维护性，但是也存在一些问题，比如说内存占用问题，用vue.js开发的页面内存占用相比于传统方式会更多，而且传统的开发方式页面渲染完后，还能对不需要的js对象进行垃圾回收，但vue.js里面的一些指令对象、watcher对象、data数据等似乎目前都没有找到比较好的垃圾回收的方式。想问下对于那些只用渲染一次的页面部分（比如数据量较大的列表页）有没有比较合适的内存优化方案（比如释放指令对象、watcher对象、data对象）？举个例子：比如其中的lazy指令，以及对于items这个基本上只用渲染一次的data等有没有可以优化内存占用的方法",
     *           "likeNum": 0,
     *           "commentNum": 0,
     *           "clickNum": 1,
     *           "isTop": 0,
     *           "state": true,
     *           "updateDate": "2018-11-16",
     *           "date": "2018-11-16 23:00:16",
     *           "appShowType": "0", // app端展示模式 0，1，2，3
     *           "sImg": "/upload/images/img20181116225948.jpeg",
     *           "tags": [
     *               {
     *                "_id": "Y3DTgmHK3",
     *                "name": "区块链",
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Y3DTgmHK3"
     *                }
     *            ],
     *           "categories": [
     *                {
     *                "_id": "Nycd05pP",
     *                "name": "人工智能",
     *                "defaultUrl": "artificial-intelligence",
     *                "enable": true,
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Nycd05pP"
     *                }
     *            ],
     *           "type": "1",
     *           "id": "Y1XFYKL52"
     *        }
     *    ]
     *}
     * @apiSampleRequest http://localhost:8080/api/user/getMyFavoriteContents
     * @apiVersion 1.0.0
     */
    async getMyFavorite(ctx, app) {

        try {
            let service=ctx.service[SERVICE_NAME];


            let payload = ctx.query;
            let userInfo = ctx.session.user;



            let queryObj = {
                state: '2'
            };

            let targetUser = await ctx.service.user.item(ctx, {
                query: {
                    _id: userInfo._id
                }
            })
            queryObj._id = {
                $in: targetUser.favorites
            }

            let favoriteContentsData = await service.find(payload, {
                query: queryObj,
                searchKeys: ['name'],
                files: this.getListFields()
            })

            favoriteContentsData.docs = await this.renderList(ctx, userInfo._id, favoriteContentsData.docs);

            ctx.helper.renderSuccess(ctx, {
                data: favoriteContentsData
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },



    /**
     * @api {post} /api/xxxx/addOne 创建文档
     * @apiDescription 创建文档
     * @apiName /xxxx/addOne
     * @apiParam {string}  token 登录时返回的参数鉴权
     * @apiParam {string}  title   文档标题，必填
     * @apiParam {string}  discription  文档简介，必填
     * @apiParam {string}  sImg  文档首图(url)，必填
     * @apiParam {string}  type    文档类型，必填(1:普通)
     * @apiParam {string}  draft   是否草稿(1:是，0:不是)
     * @apiParam {string}  tags   文档标签ID(目前只传1个)，必填
     * @apiParam {string}  keywords   关键字,非必填
     * @apiParam {string}  comments   文档详情(html 格式，必填)
     * @apiParam {string}  simpleComments   文档详情简约版(html 格式，客户端端传值和comments字段一样，必填)
     * @apiGroup Content
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *    "status": 200,
     *    "message": "addContent",
     *    "server_time": 1548037382973,
     *    "data": {
     *    }
     *}
     * @apiSampleRequest http://localhost:8080/api/content/addOne
     * @apiVersion 1.0.0
     */
    async add(ctx, app) {


        try {
            let service=ctx.service[SERVICE_NAME];

            let fields = ctx.request.body;

            this.checkContentFormData(ctx, fields);

            let targetKeyWords = [];
            if (fields.keywords) {
                if ((fields.keywords).indexOf(',') >= 0) {
                    targetKeyWords = (fields.keywords).split(',');
                } else if ((fields.keywords).indexOf('，') >= 0) {
                    targetKeyWords = (fields.keywords).split('，');
                }
            }

            const contentFormObj = {
                title: fields.title,
                stitle: fields.stitle,
                type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                tags: fields.tags,
                keywords: targetKeyWords,
                sImg: fields.sImg,
                author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
                state: fields.state,
                dismissReason: fields.dismissReason,
                isTop: fields.isTop,
                discription: xss(fields.discription),
                comments: fields.comments,
                simpleComments: xss(fields.simpleComments),
                likeUserIds: [],
                type: fields.type
            }

            // 设置显示模式
            let checkInfo = siteFunc.checkContentType(contentFormObj.simpleComments);
            contentFormObj.appShowType = checkInfo.type;
            contentFormObj.imageArr = checkInfo.imgArr;
            contentFormObj.videoArr = checkInfo.videoArr;
            if (checkInfo.type == '3') {
                contentFormObj.videoImg = checkInfo.defaultUrl;
            }

            contentFormObj.simpleComments = siteFunc.renderSimpleContent(contentFormObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

            // TODO 临时控制普通用户添加1天内不超过30篇
            let rangeTime = getDateStr(-1);
            let hadAddContentsNum = await service.count({
                uAuthor: ctx.session.user._id,
                date: {
                    "$gte": new Date(rangeTime.startTime),
                    "$lte": new Date(rangeTime.endTime)
                }
            });

            if (hadAddContentsNum > 30) {
                throw new Error(ctx.__("validate_forbid_more_req"));
            }

            contentFormObj.comments = xss(fields.comments);
            contentFormObj.tags = Array(contentFormObj.tags);
            contentFormObj.stitle = contentFormObj.title;
            contentFormObj.uAuthor = ctx.session.user._id;
            if (fields.draft == '1') {
                contentFormObj.state = '0'
            } else {
                contentFormObj.state = '1'
            }
            contentFormObj.author = '';

            let newContent = await service.create(contentFormObj);

            ctx.helper.renderSuccess(ctx, {
                data: {
                    id: newContent._id
                }
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    /**
     * @api {post} /api/xxxx/updateOne 更新文档
     * @apiDescription 更新文档
     * @apiName /xxxx/updateOne
     * @apiParam {string}  token 登录时返回的参数鉴权
     * @apiParam {string}  id 文档ID
     * @apiParam {string}  title   文档标题，必填
     * @apiParam {string}  discription  文档简介，必填
     * @apiParam {string}  sImg  文档首图(url)，必填
     * @apiParam {string}  type    文档类型，必填(1:普通)
     * @apiParam {string}  draft   是否草稿(1:是，0:不是)
     * @apiParam {string}  tags   文档标签ID(目前只传1个)，必填
     * @apiParam {string}  keywords   关键字,非必填
     * @apiParam {string}  comments   文档详情(html 格式，必填)
     * @apiParam {string}  simpleComments   文档详情简约版(html 格式，客户端端传值和comments字段一样，必填)
     * @apiGroup Content
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *    "status": 200,
     *    "message": "addContent",
     *    "server_time": 1548037382973,
     *    "data": {
     *    }
     *}
     * @apiSampleRequest http://localhost:8080/api/content/updateOne
     * @apiVersion 1.0.0
     */
    async update(ctx, app) {


        try {
            let service=ctx.service[SERVICE_NAME];

            let fields = ctx.request.body;

            this.checkContentFormData(ctx, fields);

            let targetContent = await service.item(ctx, {
                query: {
                    uAuthor: ctx.session.user._id
                }
            })

            if (_.isEmpty(targetContent)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            const contentObj = {
                title: fields.title,
                stitle: fields.stitle || fields.title,
                type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                tags: fields.tags,
                keywords: fields.keywords ? (fields.keywords).split(',') : [],
                sImg: fields.sImg,
                author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
                state: fields.state,
                dismissReason: fields.dismissReason,
                isTop: fields.isTop || '',
                discription: xss(fields.discription),
                comments: fields.comments,
                simpleComments: xss(fields.simpleComments),
                type: fields.type
            }

            // 设置显示模式
            let checkInfo = siteFunc.checkContentType(contentObj.simpleComments);
            contentObj.appShowType = checkInfo.type;
            contentObj.imageArr = checkInfo.imgArr;
            contentObj.videoArr = checkInfo.videoArr;

            contentObj.simpleComments = siteFunc.renderSimpleContent(contentObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

            if (checkInfo.type == '3') {
                contentObj.videoImg = checkInfo.defaultUrl;
            }

            contentObj.comments = xss(fields.comments);
            contentObj.stitle = contentObj.title;
            contentObj.uAuthor = ctx.session.user._id;

            if (fields.draft == '1') {
                contentObj.state = '0'
            } else {
                contentObj.state = '1'
            }
            contentObj.author = '';
            contentObj.updateDate = new Date();

            await service.update(ctx, fields.id, contentObj);

            ctx.helper.renderSuccess(ctx, {
                data: {}
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    // /**
    //  * @api {post} /api/content/getWordHtmlContent 获取Word文档Html信息
    //  * @apiDescription 获取Word文档Html信息
    //  * @apiName /content/getWordHtmlContent
    //  * @apiGroup Content
    //  * @apiSuccess {json} result
    //  * @apiSuccessExample {json} Success-Response:
    //  *{
    //  *    "status": 200,
    //  *    "data": "Word转HTML的内容"
    //  *    "server_time": 1548037382973,
    //  *}
    //  * @apiSampleRequest http://localhost:8080/api/content/getWordHtmlContent
    //  * @apiVersion 1.0.0
    //  * @author yangzhijie1488@163.com
    //  */
    // async getWordHtmlContent(ctx, app) {
    //     try {

    //         // 获取 steam
    //         const stream = await ctx.getFileStream();

    //         // 上传基础目录
    //         let uploadOptions = app.config.doraUploadFile.uploadFileFormat;
    //         const uplaodBasePath = uploadOptions.upload_path + '/upload';
    //         const dayStr = moment().format('YYYYMMDD');

    //         if (!fs.existsSync(uplaodBasePath)) {
    //             fs.mkdirSync(uplaodBasePath);
    //         }
    //         // 保存路径
    //         let savePath = path.join(uplaodBasePath, 'file');
    //         if (!fs.existsSync(savePath)) {
    //             fs.mkdirSync(savePath);
    //         }

    //         savePath = path.join(uplaodBasePath, 'file', dayStr);
    //         if (!fs.existsSync(savePath)) {
    //             fs.mkdirSync(savePath);
    //         }

    //         // 生成文件名
    //         var basename = path.basename(stream.filename);
    //         basename = basename.substring(0, basename.lastIndexOf('.') - 1);

    //         const filename = basename + '_' + Date.now() + '_' + Number.parseInt(Math.random() * 10000) + path.extname(stream.filename);

    //         // 生成写入路径 
    //         const target = path.join(savePath, filename);

    //         // 写入流
    //         const writeStream = fs.createWriteStream(target);

    //         try {
    //             // 写入文件
    //             await awaitStreamReady(stream.pipe(writeStream));

    //             savePath = path.join(uplaodBasePath, 'images');
    //             if (!fs.existsSync(savePath)) {
    //                 fs.mkdirSync(savePath);
    //             }

    //             savePath = path.join(uplaodBasePath, 'images', dayStr);
    //             if (!fs.existsSync(savePath)) {
    //                 fs.mkdirSync(savePath);
    //             }

    //             var options = {
    //                 convertImage: mammoth.images.imgElement(function (image) {
    //                     var fileType = image.contentType.toLowerCase();
    //                     fileType = fileType.substring(fileType.indexOf('/') + 1);

    //                     const imageName = Date.now() + '' + Number.parseInt(Math.random() * 10000) + "." + fileType;
    //                     const imageFullName = path.join(savePath, imageName);

    //                     return image.read("base64").then(async function (imageBuffer) {
    //                         var dataBuffer = new Buffer(imageBuffer, 'base64');
    //                         fs.writeFileSync(imageFullName, dataBuffer, "binary");
    //                         let resultPath = `${app.config.static.prefix}/upload/images/${dayStr}/${imageName}`;
    //                         let uploadResult = await ctx.helper.reqJsonData('upload/filePath', {
    //                             imgPath: resultPath,
    //                             localImgPath: imageFullName,
    //                             filename: imageName
    //                         }, "post");
    //                         // console.log('---uploadResult--', uploadResult);
    //                         return {
    //                             src: uploadResult.path
    //                         };
    //                     });
    //                 })
    //             };

    //             var result = await mammoth.convertToHtml({
    //                 path: target
    //             }, options);

    //             var html = result.value;

    //             ctx.helper.renderSuccess(ctx, {
    //                 data: html
    //             });

    //         } catch (err) {
    //             // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
    //             await sendToWormhole(stream);
    //             throw err;
    //         }
    //     } catch (err) {
    //         ctx.helper.renderFail(ctx, {
    //             message: err
    //         });
    //     }
    // },

    // 获取封面背景图列表
    async getCoverList(ctx, app) {

        try {

            let queryObj = ctx.query || {};
            let coverList = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/contentCover/getList', queryObj);

            ctx.helper.renderSuccess(ctx, {
                data: coverList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    // 获取单个封面信息
    async getOneCover(ctx, app) {

        try {

            let queryObj = ctx.query || {};
            let coverObj = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/contentCover/getOne', queryObj);

            ctx.helper.renderSuccess(ctx, {
                data: coverObj
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    // 获取封面背景图类别列表
    async getCoverTypeList(ctx, app) {

        try {

            let payload = {};
            let coverTypeList = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/coverType/getList', payload);

            ctx.helper.renderSuccess(ctx, {
                data: coverTypeList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    // 上传base64合成后的背景图
    async uploadPreviewImgByBase64(ctx, app) {

        try {

            let fields = ctx.request.body || {};
            if (!fields.base64) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let uploadOptions = app.config.doraUploadFile.uploadFileFormat;
            const uplaodBasePath = uploadOptions.upload_path + '/upload';
            const dayStr = moment().format('YYYYMMDD');

            let savePath = path.join(uplaodBasePath, 'images');
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }

            savePath = path.join(uplaodBasePath, 'images', dayStr);
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }

            const imageName = Date.now() + '' + Number.parseInt(Math.random() * 10000) + ".png";
            const imageFullName = path.join(savePath, imageName);

            var dataBuffer = new Buffer(fields.base64, 'base64');

            fs.writeFileSync(imageFullName, dataBuffer, "binary");
            let resultPath = `${app.config.static.prefix}/upload/images/${dayStr}/${imageName}`;
            let uploadResult = await ctx.helper.reqJsonData('upload/filePath', {
                imgPath: resultPath,
                localImgPath: imageFullName,
                filename: imageName
            }, "post");

            ctx.helper.renderSuccess(ctx, {
                data: uploadResult.path
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    // 随机获取图片
    async getRandomImg(ctx, app) {

        try {
            let service=ctx.service[SERVICE_NAME];

            let payload = ctx.query;
            let pageSize = ctx.query.pageSize || 1;
            let queryObj = {
                type: '1',
                state: '2'
            };

            // 只查询可见分类的文章
            let ableCateList = await this.getEnableCateList(ctx, false);
            _.assign(queryObj, {
                categories: {
                    $in: ableCateList
                }
            });

            const totalContents = await service.count(queryObj);
            let randomArticles = await service.find(_.assign(payload, {
                isPaging: '0',
                pageSize,
                skip: Math.floor(totalContents * Math.random())
            }), {
                query: queryObj,
                files: 'sImg'
            })

            let sImgArr = [];

            for (const articleItem of randomArticles) {
                if (articleItem.sImg) {
                    sImgArr.push(articleItem.sImg);
                }
            }

            ctx.helper.renderSuccess(ctx, {
                data: sImgArr
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

}

module.exports = ControllerPlugin;