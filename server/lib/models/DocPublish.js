/**
 * Created by Dr on 2019/11/10.
 * 演出信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 继承自Doc
let Parent=require("./Content")

// var ContentCategory = require('./ContentCategory');
var ContentTag = require('./ContentTag');
// var AdminUser = require('./AdminUser');
var User = require('./User');
let Artist = require("./Artist");

let optionsSchema={
    // discriminatorKey:"doc",
    // collection: 'Artist',
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
    // tags: [{
    //     type: String,
    //     ref: 'ContentTag'
    // }], // 标签 
    // isTop: {
    //     type: Number,
    //     default: 0
    // }, // 是否推荐，默认不推荐 0为不推荐，1为推荐
    // roofPlacement: {
    //     type: String,
    //     default: '0'
    // }, // 是否置顶，默认不置顶 0为不置顶，1为置顶
    formats:{
        type:String,
        default:"中国/China"
    },//发行方式
    dateRelease:{
        type: Date,
        default: Date.now,
    },//发行日期
    catalog:{
        type:String,
        default:"#"
    },//编号
    listTracks:[{
        title:{type:String,default:"Track"},
        url:{type:String,default:"#"},
    }],//音轨
    listLink:[{
        title:{type:String,default:"站外链接"},
        url:{type:String,default:"#"},
    }]//外链地址

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
// schema.virtual('title').get(function () {
//     return this.name;
// }).set(function(v){
//     this.name=v;
// });
module.exports = Parent.discriminator("DocPublish", schema);//mongoose.model("Artist", schema);