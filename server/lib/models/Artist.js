/**
 * Created by Dr on 2019/11/10.
 * 文案类,新闻资讯用
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 继承自Doc
let Doc=require("./Doc")

// var ContentCategory = require('./ContentCategory');
var ContentTag = require('./ContentTag');
// var AdminUser = require('./AdminUser');
var User = require('./User');

let optionsSchema={
    discriminatorKey:"doc",
    collection: 'Artist',
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
    // title: String,
    // stitle: String,
    tags: [{
        type: String,
        ref: 'ContentTag'
    }], // 标签 
    isTop: {
        type: Number,
        default: 0
    }, // 是否推荐，默认不推荐 0为不推荐，1为推荐
    roofPlacement: {
        type: String,
        default: '0'
    }, // 是否置顶，默认不置顶 0为不置顶，1为置顶
    // likeNum: {
    //     type: Number,
    //     default: 0
    // }, // 喜欢数
    // genre:{
    //     type:String,
    //     default:0
    // },//风格
    listMembers:[{
        type: String,
        ref: 'User'
    }],//乐队成员
    from:{
        type: String,
        default:"中国/China",
    },
    dateEnd: {
        type: Date,
        default: null,
    },//退出厂牌时间
});


// ArtistSchema.index({
//     state: 1,
//     uAuthor: 1
// }); // 添加索引
//处理名字函数
// DocSchema.virtual('nameMain').get(function () {
//     let objName=JSON.parse(this.name);
//     if(objName!=undefined){//保存的是JSON，解析
//         this.nameEN=objName.nameEN || objName.nameCN;
//         return this.name=objName.nameCN;
//     }
//     return this.name;
// }).set(function (v) {
//     let objName=JSON.parse(v);
//     if(objName!=undefined){//保存的是JSON，解析
//         this.name=v;
//     }else{
//         this.name=v;
//     }
// });
module.exports = Doc.discriminator("Artist", schema);//mongoose.model("Artist", schema);