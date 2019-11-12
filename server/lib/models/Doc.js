/**
 * Created by Dr on 2019/11/10.
 * 文档类
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 继承自DocBase
// let DocBase=require("./DocBase")


var settings = require('@configs/settings');
var moment = require('moment')
moment.locale((settings.lang).toLowerCase());

var shortid = require('shortid');
// var User = require('./User');

let optionsSchema={
    discriminatorKey:"doc",
    collection: 'docs',
    toJSON:{
        getters: true,
        virtuals: true
    },
    toObject:{
        getters: true,
        virtuals: true
    },
}
var schema = new Schema({
    // _id: Schema.Types.ObjectId,
    _id: {
        type: String,
        'default': shortid.generate
    },
    name: String,//JSON
    alias: String,//别名多语言用
    type: {
        type: String,
        default: "1"
    }, // 发布类型 1位普通，2为专题
    sortPath: String, //存储所有父节点结构
    listRefs: [{
        type: String,
        ref: 'Doc'
    }], // 标签
    sImg: {
        type: String,
        default: "/upload/images/defaultImg.jpg"
    }, // 文章小图
    date: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }, // 更新时间
    cntClick: {
        type: Number,
        default: 1
    },//点击次数
    
    keywords: [{
        type: String
    }],
    discription: String,//简介
    comments: String,//详情        
    simpleComments: String, //带格式的纯文本
    markDownComments: String, // markdow格式
    state: {
        type: String,
        default: '0'
    }, // 0草稿 1待审核 2审核通过 3下架
    dismissReason: String, // 驳回原因(针对审核不通过)

    appShowType: {
        type: String,
        default: '1'
    }, // app端排版格式 0 不显示图片 1小图 2大图 3视频
    imageArr: [{
        type: String
    }], // 媒体集合（图片）
    videoImg: {
        type: String,
        default: ""
    }, // 视频缩略图
    videoArr: [{
        type: String
    }], // 媒体集合（影片）
    duration: {
        type: String,
        default: '0:01'
    }, // 针对有视频的帖子时长

},optionsSchema);


schema.index({
    name:1,
    state: 1,
    // uAuthor: 1
}); // 添加索引

// 设置Tags虚拟属性
// tags: [{
//     type: String,
//     ref: 'ContentTag'
// }], // 标签

// schema.virtual('tags').get(function () {
//     return this.listRefs;
// }),set(function(v){
//     this.listRefs
// });

module.exports = mongoose.model("Doc", schema);//DocBase.discriminator("Doc", DocSchema);