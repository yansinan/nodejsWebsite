/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
 module.exports = app => {
    const mongoose = app.mongoose
    var Schema = mongoose.Schema;
    var moment = require('moment')
    var shortid = require('shortid');
    // 继承自Doc
    
    let Doc=app.model.Doc || require("./Doc")(app) || INIT_DOC(app);//

    var ContentSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        //name: String,//JSON
        //alias: String,//别名多语言用
        //title: String,
        //stitle: String,
        //type: {
        //    type: String,
        //    default: "1"
        //}, // 发布类型 1位普通，2为专题
        categories: [{
            type: String,
            ref: 'ContentCategory'
        }], //文章类别
        //sortPath: String, //存储所有父节点结构
        //tags: [{
        //    type: String,
        //    ref: 'ContentTag'
        //}], // 标签
        //keywords: [{
        //    type: String
        //}],
        //sImg: {
        //    type: String,
        //    default: "/upload/images/defaultImg.jpg"
        //}, // 文章小图
        sImgType: {
            type: String,
            default: '2'
        }, // 首图类型 1：自动生成 2：本地上传
        cover: String, // 封面id
        //videoImg: {
        //    type: String,
        //    default: ""
        //}, // 视频缩略图
        //discription: String,
        //appShowType: {
        //    type: String,
        //    default: '1'
        //}, // app端排版格式 0 不显示图片 1小图 2大图 3视频
        //imageArr: [{
        //    type: String
        //}], // 媒体集合（图片）
        //videoArr: [{
        //    type: String
        //}], // 媒体集合（影片）
        //duration: {
        //    type: String,
        //    default: '0:01'
        //}, // 针对有视频的帖子时长
        //date: {
        //    type: Date,
        //    default: Date.now
        //},
        //updateDate: {
        //    type: Date,
        //    default: Date.now
        //}, // 更新时间
        uAuthor: {
            type: String,
            ref: 'User'
        }, // 文档作者(普通用户)
        //state: {
        //    type: String,
        //    default: '0'
        //}, // 0草稿 1待审核 2审核通过 3下架
        draft: {
            type: String,
            default: '0'
        }, // 是否进入回收站 1:是  0:否
        //dismissReason: String, // 驳回原因(针对审核不通过)
        //isTop: {
        //    type: Number,
        //    default: 0
        //}, // 是否推荐，默认不推荐 0为不推荐，1为推荐
        //roofPlacement: {
        //    type: String,
        //    default: '0'
        //}, // 是否置顶，默认不置顶 0为不置顶，1为置顶
        clickNum: {
            type: Number,
            default: 1
        },
        //comments: String,
        //simpleComments: String, //带格式的纯文本
        //markDownComments: String, // markdow格式
        commentNum: {
            type: Number,
            default: 0
        }, // 评论数
        likeNum: {
            type: Number,
            default: 0
        }, // 喜欢数

    });


    ContentSchema.index({
        state: 1,
        uAuthor: 1
    }); // 添加索引

    ContentSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    ContentSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    //ContentSchema.path('date').get(function (v) {
    //    return moment(v).format("YYYY-MM-DD");
    //});
    //ContentSchema.path('updateDate').get(function (v) {
    //    return moment(v).format("YYYY-MM-DD HH:mm:ss");
    //});

    ContentSchema.virtual('url').get(function () {
        return `/doc___${this._id}.html`;
    });
    //// 为了和doc同步;
    //ContentSchema.path('stitle').get(function (v) {
    //    return v;
    //}).set((v)=>{
    //    this.alias=v;
    //    //this.stitle=v;
    //    return v;
    //});
    //ContentSchema.path('title').get(function (v) {
    //    return v;
    //}).set((v)=>{
    //    this.name=v;
    //    //this.title=v;
    //    return v;
    //});
    //ContentSchema.path('name').get(function (v) {
    //    return v || this.title;
    //});
    //ContentSchema.path('alias').get(function (v) {
    //    return v || this.stitle;
    //});
    //ContentSchema.virtual('title').get(function () {
    //    return this.name;
    //})
    //ContentSchema.virtual('title').set(function(v){
    //    debugger;
    //    this.name=v;
    //});
    //ContentSchema.virtual('stitle').get(function (){
    //    return this.alias;
    //})
    //ContentSchema.virtual('stitle').set(function(v){
    //    this.alias=v;
    //});
    // 时间轴标题
    ContentSchema.virtual('nameTimeline').get(function (){
        return this.name || this.title;
    })
    // 客户端用的doc别名;
    ContentSchema.virtual('docAlias').get(function (v){
        return "news";
    })
    // 搜索结果类名:
    ContentSchema.virtual('docAliasSearch').get(function () {
        return "动态";
    });

    let model=app.model.Content || Doc.discriminator("Content", ContentSchema);
    // app.model.Artist=model;

    return model//mongoose.model("Artist", schema);

    // return mongoose.model("Content", ContentSchema, 'contents');

}