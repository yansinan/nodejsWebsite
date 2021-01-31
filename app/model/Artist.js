/**
 * Created by Dr on 2019/11/10.
 * 文案类,新闻资讯用
 */

module.exports =app=>{
    {
        // const app=this.app;
        const mongoose = app.mongoose
        var Schema = mongoose.Schema;
        var moment = require('moment')
        // 继承自Doc
        
        let Doc=app.model.Doc || require("./Doc")(app) || INIT_DOC(app);//
        
        // var ContentTag = require('./ContentTag');
        // var User = require('./User');
        
        // var ContentCategory = require('./ContentCategory');
        // var AdminUser = require('./AdminUser');
        
        
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
            // likeNum: {
            //     type: Number,
            //     default: 0
            // }, // 喜欢数
            // genre:{
            //     type:String,
            //     default:0
            // },//风格
            date: {
                type: Date,
                default: Date.now
            },
            listMembers:[{
                type: String,
                ref: 'User'
            }],//乐队成员
            from:{
                type: String,
                default:"中国/China",
            },
            listDateDur:[{
                type: Date,
                default: [Date.now],
            }],//加入厂牌时间
            // dateJoin: {
            //     type: Date,
            //     default: Date.now,
            // },//加入厂牌时间
            // dateExit: {
            //     type: Date,
            //     default: null,
            // },//退出厂牌时间
            listHotMusics:[{
                url:{type:String},
                name:{type:String},
                type:{type:String,default:"音乐"},
            }],//推荐热门歌曲
            listLinks:[{
                url:{type:String},
                name:{type:String},
                icon:{type:String},
                type:{type:String,default:"社交"},
            }],//相关链接
            listImages:[{
                url:{type:String},
                name:{type:String},
                type:{type:String,default:"link"},
            }],//相关照片
            listVideos:[{
                // _id:{type:String,default:''},
                // url:{type:String},
                name:{type:String},
                type:{type:String,default:"link"},
                date:{type:Date,default:Date.now},
                idURL:{type:String,default:""},
                status:{type:String,default:""},
                urlImg:{type:String,default:""},
                urlVideo:{type:String,default:""},
                link:{type:String},//外链网页，用于分析id数据
            }],//相关视频
            idNCM:{
                type:String,
                default:""
            },//网易云音乐id,idNCM=="ignore"则忽略更新
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
        // schema.virtual('tags').get(function () {
        //     return this.listRefs;
        // }).set(function(v){
        //     this.listRefs
        // });
        schema.virtual('dateStart').get(function () {
            return (this.listDateDur && this.listDateDur[0])?this.listDateDur[0] : false;
        }).set(function(v){
            this.listDateDur[0]=v || Date.now;
            this.date=this.listDateDur[0];
            return this.listDateDur[0];
        });
        schema.virtual('dateEnd').get(function () {
            return (this.listDateDur && this.listDateDur[1] )? this.listDateDur[1] : false ;
        }).set(function(v){
            this.listDateDur[1]=v;
            return this.listDateDur[1];
        });
        // TODO:没弄懂，v输出总是undefinded
        // schema.path('listDateDur').get(v=>(v)).set(function (v) {
        //     let tmp=this.listDateDur;
        //     if ((this instanceof mongoose.Document ) && v != null && v.length>0 && v[0]) {
        //         this.date=v[0];
        //     }
        //     return v;
        // });
        schema.path('date').get(function (v) {            
            let res=((this.listDateDur && this.listDateDur[0])?this.listDateDur[0]:false) || v;
            return res;
        }).set(function (v) {
            let res=((this.listDateDur && this.listDateDur[0])?this.listDateDur[0]:false) || v;
            return res;
        });

        schema.virtual('dateTimeline').get(function () {
            return (this.listDateDur && this.listDateDur[0])?moment(this.listDateDur[0]).format("YYYY-MM-DD") : false;;
        });
        // url地址
        schema.virtual('url').get(function () {
            return `/artist/${this._id}.html`;
        });
        let model=app.model.Artist || Doc.discriminator("Artist", schema);
        // app.model.Artist=model;
    
        return model//mongoose.model("Artist", schema);
    }

}
