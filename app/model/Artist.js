/**
 * Created by Dr on 2019/11/10.
 * 文案类,新闻资讯用
 */

module.exports =app=>{
    {
        // const app=this.app;
        const mongoose = app.mongoose
        var Schema = mongoose.Schema;
    
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
            listDateDur:[{
                type: Date,
                default: Date.now,
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
            }],//推荐热门歌曲
            listLinks:[{
                url:{type:String},
                name:{type:String},
                icon:{type:String},
                type:{type:String,default:"社交"},
            }],//相关链接
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
        schema.virtual('dateJoin').get(function () {
            return (this.listDateDur && this.listDateDur[0])?this.listDateDur[0] : false;
        }).set(function(v){
            this.listDateDur[0]=v;
        });
        schema.virtual('dateExit').get(function () {
            return (this.listDateDur && this.listDateDur[1] )? this.listDateDur[1] : false ;
        }).set(function(v){
            this.listDateDur[1]=v;
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
