const Controller = require('egg').Controller;
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

class APIController extends Controller {
    // 找到乐队对应的标签
    async findIdTags(inListArtists){
        const {
            ctx,
            app
        } = this;
        //let payload = inArtist.name;
        //let fields = {
        //    query : {},
        //    searchKeys : ['name'],
        //    populate : [],
        //    files : null
        //};
        //fields=Object.assign(fields,ctx.request.body || {});
        //let contentTagList = await ctx.service.contentTag.find(payload, fields);
        let listNameArtists=inListArtists.map(v=>(v.name));
        let tag=await ctx.service.contentTag.item(ctx, {
            query: {
                name: listNameArtists
            }
        })
        return _.isEmpty(tag)?[]:[tag._id];
    }
    // 时间线：// 获取时间线:演出，唱片，新闻，视频，加入
    async getListTimeline(inArtist){
        const {
            ctx,
            app
        } = this;
        let targetId=inArtist._id;
        try {
            let listIdTags=await this.findIdTags([inArtist]);
            let listTimeline=(await ctx.service.doc.find({
                pageSize: 0,
                isPaging:"0",
                lean:false,
            }, {
                sort: {date: -1},
                query: {                    
                    state: '2',
                    //$or:[
                    //    {listRefs:targetId},
                    //    {tags: {"$elemMatch":{name:[inArtist.name]}}},
                    //    //{["tags.name"]:inArtist.name},
                    //],
                    $or:[
                        {tags: {"$in" : listIdTags }},
                        {listRefs: {"$in" : [targetId] }},
                    ],

                },
                searchKeys: ['listRefs','sImg', 'title', 'date',"tags"],
                //populate:[{
                //    path: 'tags',
                //    select: 'name url _id'
                //},],
                populate:[],
                files: "sImg name title date url nameTimeline tags"
            }));
            listTimeline.push({
                name:inArtist.nameTimeline,
                dateTimeline:inArtist.dateStart,
                url:inArtist.url,
            })
            return listTimeline.map(v=>{
                //let source=v.url.split("/")[1];//artist,show,record,detail
                //let strDefault=source == "record"?"发布：":"";
                let strDefault=v.nameTimeline || v.name;
                return {
                    name: strDefault,
                    dateTimeline: moment(new Date(v.date)).format("MM-DD"),
                    dateYear:moment(new Date(v.date)).format("YYYY"),
                    url:v.url,
                }
            })
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
            debugger
        }
    }
        // 字段列表：
    getListFields(type = '') {

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
            files = '_id url name firstLetter letters alias sImg date discription clickNum roofPlacement type appShowType imageArr videoArr duration simpleComments comments videoImg state dismissReason categories isTop from listHotMusics listLinks listMembers listDateDur listVideos listImages dateStart dateEnd dateYear'
        }
        // console.log('--files----', files)
        return files;
    }
    renderList(userId = "", inList = []) {
        const {
            ctx,
            app
        } = this;
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

    }

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
    async list() {
        const {
            ctx,
            app
        } = this;
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
            // 请求类型page 整页；dom 局部;
            let type = payload.type || "page";

            let service=ctx.service[SERVICE_NAME];

            let queryObj = {
                    state: '2'
                },
                sortObj = {
                    letters:-1,
                    firstLetter:-1,
                    date: -1,
                };


            if (ctx.query.pageType == 'index') {
                sortObj = {
                    letters:-1,
                    firstLetter:-1,
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

            let listRes = await service.find(payload, {
                sort: sortObj,
                query: queryObj,
                searchKeys: ['userName', 'name', 'comments', 'discription'],
                files: this.getListFields(filesType)
            });
            // 乐队推荐&置顶消息
            let listIdArtists=listRes.map(v=>(v.id));
            let listNameArtists=listRes.map(v=>(v.name));
            let listIdTags=await this.findIdTags(listNameArtists);

            let listDocNotice = await ctx.service.doc.find(
                {
                    //filesType:"timelineBar", 
                    pageSize: 0,
                    isPaging:"0",
                    lean:false,
                },{
                    query:{
                        $or:[
                            // {tags: {"$elemMatch":{name:listNameArtists}}},
                            {tags: {$in:listIdTags}},
                            {listRefs: {"$in" : listIdArtists }},
                        ],
                        $or:[{isTop:1},{roofPlacement: "1"}],
                    },
                    files:"_id date listDateDur dateTimeline name title nameTimeline alias tags nameArtists sImg url listRefs",
                    populate:[{
                        path: 'tags',
                        select: 'name url'
                    },],
                    sort:{date: -1,roofPlacement: -1,},
                    searchKeys:['listRefs',"roofPlacement"]
                });
            listRes.forEach(artist=>{
                artist.listNotices=listDocNotice.filter(doc=>{
                    let isRef=doc.listRefs.find(v=>(v==artist._id || v._id==artist._id));
                    let isTag=doc.tags.find(v=>(v.name==artist.name));
                    let docFind= isRef || isTag;
                    if(docFind)doc=JSON.parse(JSON.stringify(doc));
                    return docFind;
                });
                artist.listNotices=artist.listNotices.splice(0,Math.min(artist.listNotices.length,2));
            })
            let listTmpRes = await this.renderList(userInfo._id, listRes.docs || listRes);
            // 为了适配isPaging=0 && pageSize=0全部列表的结果是数组的情况；
            if(listRes.docs)listRes.docs=listTmpRes;
            else listRes={docs:listTmpRes};
            //这里直接渲染模板?
            let path="../view/dorawhite/2-stage-artist/listTempArtist.html";//app/view/dorawhite/2-stage-timeline/listTempTimeline.html
            if(type=="dom")listRes.docs=await ctx.renderView(path,{posts:listRes.docs});
            
            ctx.helper.renderSuccess(ctx, {
                data: listRes
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    }
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
    async getOne() {
        const {
            ctx,
            app
        } = this;
        try {
            let targetId = ctx.query.id;
            let userId = ctx.query.userId;

            let service=ctx.service[SERVICE_NAME];


            if (!shortid.isValid(targetId)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let queryObj = {
                _id: targetId,
                //state: '2',
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
            renderContent = await this.renderList(userInfo._id, renderContent);
            // 获取唱片
            // ctx.query.idArtist=targetId;
            renderContent[0].objDocsRecords=await ctx.service.record.find({isPaging:false,pageSize:0,},{
                sort: {dateRelease: -1},
                query:{                    
                    listRefs:targetId,
                    state: '2'
                },
                files: "sImg name listFormatTags date"
            });
            //await ctx.service.record.find(ctx.query, {
            //    sort: {dateRelease: -1},
            //    query: {state: '2',listArtists:targetId},
            //    searchKeys: ['sImg', 'name', 'dateRelease', 'listFormatTags'],
            //    files: "sImg name listFormatTags date"
            //});
            // 获取时间线:演出，唱片，新闻，视频，加入
            renderContent[0].listTimeline= await this.getListTimeline(renderContent[0]);

            ctx.helper.renderSuccess(ctx, {
                data: renderContent[0]
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }
    //同步网易云音乐;
    async ncmGetAtistMV(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let _id = ctx.query.id;

        try{
            if (!shortid.isValid(_id)) throw new Error(ctx.__('validate_error_params')+_id);

            let payload=await service.item(ctx,{query:{_id:_id},files:"_id name listLinks idNCM"})
            let ncmlistVideos=await ctx.service.artist.ncmListArtistMV(payload);

            ctx.helper.renderSuccess(ctx,{
                data: ncmlistVideos
            });
        } catch (err) {
            debugger
            ctx.helper.renderFail(ctx, { message: err });
        }
    }
    // 抓网易乐队信息
    async ncmGetAtist(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let name = ctx.query.name;
        let idNCM=ctx.query.idNCM;

        try{
            if (!name && !idNCM) throw new Error(ctx.__('validate_error_params')+"name and idNCM all miss");

            let resArtistNCM=await service.ncmArtist({name,idNCM});

            ctx.helper.renderSuccess(ctx,{
                data: resArtistNCM
            });
        } catch (err) {
            debugger
            ctx.helper.renderFail(ctx, { message: err });
        }
    }
    // 抓网易乐队的专辑信息
    async ncmGetAtistAlbums(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let name = ctx.query.name;
        let idNCM=ctx.query.idNCM;
        let idArtist=ctx.query._id;

        try{
            if (!idNCM || !idArtist) throw new Error(ctx.__('validate_error_params')+"id or idNCM miss");

            let resNCM=await service.ncmArtistAlbum({idNCM,_id:idArtist});
            // 手动添加listRefs为本乐队
            resNCM.forEach(v=>(v.listRefs=[idArtist]));
            ctx.helper.renderSuccess(ctx,{
                data: resNCM
            });
        } catch (err) {
            debugger
            ctx.helper.renderFail(ctx, { message: err });
        }
    }
    
    // 抓乐队所有专辑信息
    async listRecords(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let name = ctx.query.name;
        let idArtist=ctx.query._id;

        try{
            if (!idArtist) throw new Error(ctx.__('validate_error_params')+"id");

            let res=await ctx.service.record.find({isPaging:false,pageSize:0,},{
                query:{
                    listRefs:idArtist
                }
            });

            ctx.helper.renderSuccess(ctx,{
                data: res
            });
        } catch (err) {
            debugger
            ctx.helper.renderFail(ctx, { message: err });
        }
    }
}


module.exports = APIController;