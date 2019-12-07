/*
 * @Author: doramart 
 * @Date: 2019-08-14 17:20:30 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-09-25 11:11:07
 */

module.exports = app => {
    const mongoose = app.mongoose
    var shortid = require('shortid');
    var Schema = mongoose.Schema;
    var moment = require('moment')

    var ContentCategorySchema = new Schema({
        _id: {
            type: String,

            'default': shortid.generate
        },
        uid: {
            type: Number,
            default: 0
        },
        name: String,
        keywords: String,
        type: {
            type: String,
            default: "1"
        }, // 类别类型默认1,2单页面
        sortId: {
            type: Number,
            default: 1
        }, // 排序 正整数
        parentId: {
            type: String,
            default: "0"
        },
        enable: {
            type: Boolean,
            default: true
        }, //是否公开 默认公开
        date: {
            type: Date,
            default: Date.now
        },
        contentTemp: {
            type: String,
            ref: "TemplateItems"
        }, // 内容模板
        defaultUrl: {
            type: String,
            default: ""
        }, // seo link
        homePage: {
            type: String,
            default: "ui"
        }, // 必须唯一
        sortPath: {
            type: String,
            default: "0"
        }, //存储所有父节点结构
        comments: String,
        sImg: {
            type: String
        },
    });

    ContentCategorySchema.index({
        creator: 1
    }); // 添加索引


    ContentCategorySchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    ContentCategorySchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    ContentCategorySchema.path('date').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });


    return mongoose.model("ContentCategory", ContentCategorySchema, 'contentcategories');

}