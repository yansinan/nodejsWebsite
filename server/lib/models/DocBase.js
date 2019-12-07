/**
 * Created by Dr on 2019/11/10.
 * 文档基类
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settings = require('@configs/settings');
var moment = require('moment')
moment.locale((settings.lang).toLowerCase());

var shortid = require('shortid');
var User = require('./User');

let optionsSchema={
    discriminatorKey:"docBase",
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
var DocBaseSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    _id: {
        type: String,
        'default': shortid.generate
    },
    name: String,//JSON
    alias: String,//别名多语言用
    date: {
        type: Date,
        default: Date.now
    },
    comments: String,
    // cntClick: {
    //     type: Number,
    //     default: 1
    // },//点击次数

},optionsSchema);


DocBaseSchema.index({
    name:1
    // state: 1,
    // uAuthor: 1
}); // 添加索引

DocBaseSchema.path('date').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
// DocBaseSchema.path('updateDate').get(function (v) {
//     return moment(v).format("YYYY-MM-DD HH:mm:ss");
// });

var DocBase = mongoose.model("DocBase", DocBaseSchema);

module.exports = DocBase;