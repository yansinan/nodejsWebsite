/*
 * @Author: dr 
 * @Date: 2019/11/10 20:30:53 
 * @Last Modified by: dr
 * @Last Modified time: 2021-08-23 06:10:47
 */
const INIT_DOC= app=>{
    //如果已经初始化过，则直接返回；
    if(app.model.DocModel)return app.model.DocModel;

    const mongoose = app.mongoose
    // mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useUnifiedTopology', true);
    var Schema = mongoose.Schema;

    // 继承自DocBase
    // let DocBase=require("./DocBase")
    
    
    
    var moment = require('moment')
    
    var shortid = require('shortid');
    // var User = require('./User');
    const _ = require('lodash');
    
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
    schema.path('alias').get(function (v) {
        return _.isEmpty(v) ? getPinYin(this.name) : v;
    });
    schema.path('date').get(function (v) {
        return moment(v).format("YYYY-MM-DD");
    });
    schema.path('updateDate').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });
    schema.path('tags').get(function (v) {
        return v.filter(v=>(!_.isEmpty(v)));
    }).set(function(v){
        return v.filter(v=>(!_.isEmpty(v)));
    });
    schema.virtual('title').get(function () {
        return this.name;
    });
    // 年份信息
    schema.virtual('dateYear').get(function () {
        return moment(new Date(this.date)).format("YYYY") + " ";
    });
    schema.virtual('dateTimeline').get(function () {
        return moment(this.date).format("MM/DD");
    });
    schema.virtual('dateYYYYM').get(function () {
        return " "+moment(this.date).format("YYYYM");
    });
    schema.virtual('dateMM').get(function () {
        return " "+moment(this.date).format("M月");
    });
    schema.virtual('dateFull').get(function () {
        return moment(this.date).format("YYYY-MM-DD");
    });
    // date在全年天数的百分比;
    schema.virtual('percentDateOfYear').get(function (){        
        //全年天数;
        let cntDaysFullYear=Math.abs(moment(this.date).startOf("year").diff(moment(this.date).endOf("year"),"days"));
        //当前第几天
        let idxDayOfYear=Math.abs(moment(this.date).startOf("year").diff(moment(this.date),"days"));
        //console.log(this.name || this.title,this.doc,moment(this.date).format("YYYY-MM-DD"),idxDayOfYear,cntDaysFullYear,Math.abs(idxDayOfYear*100/cntDaysFullYear).toFixed(3))
        return Math.abs(idxDayOfYear*100/cntDaysFullYear).toFixed(3);
    })
    // 客户端用的doc别名;
    schema.virtual('docAlias').get(function (v){        
        const dictTimeline={
            "Record":"records",
            "Content":"news",
            "Artist":"artists",
        }
        return dictTimeline[this.doc || "news"];
    })
    // 时间轴标题
    schema.virtual('nameTimeline').get(function (){
        return this.name;
    })
    app.model=app.model || {};
    let model=app.model.DocModel || mongoose.model("Doc", schema);
    app.model.DocModel=model;
    return model;//mongoose.model("Doc", schema);//DocBase.discriminator("Doc", DocSchema);
    // module.exports = mongoose.model("Doc", schema);//DocBase.discriminator("Doc", DocSchema);
}

module.exports = app => {return INIT_DOC(app)}

