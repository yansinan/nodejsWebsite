/**
 * Created by Administrator on 2015/4/15.
 * 系统模板对象
 */
module.exports = app => {
    const mongoose = app.mongoose
    var shortid = require('shortid');
    var Schema = mongoose.Schema;

    var ContentTemplateSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        name: String,
        alias: {
            type: String,
            default: "defaultTemp"
        }, //别名 指向模板文件夹
        version: [{
            type: String,
        }], // 适用版本
        items: [{
            type: String,
            ref: 'TemplateItems'
        }],
        sImg: {
            type: String,
            default: '/stylesheets/backstage/img/screenshot.png'
        },
        author: {
            type: String,
            default: "doramart"
        }, // 主题作者
        using: {
            type: Boolean,
            default: false
        }, // 是否被启用
        date: {
            type: Date,
            default: Date.now
        },
        comment: String // 主题描述
    });


    return mongoose.model("ContentTemplate", ContentTemplateSchema, 'contenttemplates');

}