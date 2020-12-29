/**
 * Created by Dr on 2020/12/19.
 * 演出信息
 */

module.exports =app=>{
    {
        const mongoose = app.mongoose
        var Schema = mongoose.Schema;
        var moment = require('moment')

        // 继承自Doc        
        let Doc=app.model.Doc || require("./Doc")(app) || INIT_DOC(app);//
        
        let optionsSchema={
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
            date: {
                type: Date,
                default: Date.now
            },
            listArtists:[{
                type: String,
                ref: 'Artist'
            }],//乐队成员
            location:{
                type: String,
                default:"中国/China",
            },
            listDateDur:[{
                type: Date,
                default: [Date.now],
            }],//活动期间
            listTicketLink:[{
                url:{type:String},
                name:{type:String},
                icon:{type:String},
                type:{type:String,default:"社交"},
            }],//购票链接
            listLinks:[{
                url:{type:String},
                name:{type:String},
                icon:{type:String},
                type:{type:String,default:"社交"},
            }],//相关链接
        });        
    
        schema.virtual('dateStart').get(function () {
            return (this.listDateDur && this.listDateDur[0])?this.listDateDur[0] : false;
        }).set(function(v){
            this.listDateDur[0]=v || Date.now;
            this.date=this.listDateDur[0];
        });
        schema.virtual('dateEnd').get(function () {
            return (this.listDateDur && this.listDateDur[1] )? this.listDateDur[1] : false ;
        }).set(function(v){
            this.listDateDur[1]=v;
        });
        // schema.virtual('date').get(function () {
        //     return moment(this.dateStart).format("YYYY-MM-DD");
        // }).set((v)=>{
        //     this.dateStart = v || Date.now;
        //     this.date=this.dateStart || Date.now;
        // });
        // url地址
        schema.virtual('url').get(function () {
            return `/show/${this._id}.html`;
        });
        // 演出标题
        schema.virtual('title').get(function () {
            return this.name;
        }).set(function(v){
            this.name=v;
        });
        // 演出短标题
        schema.virtual('sTitle').get(function () {
            return this.alias;
        }).set(function(v){
            this.alias=v;
        });
        schema.path('date').get(function (v) {            
            let res=((this.listDateDur && this.listDateDur[0])?this.listDateDur[0]:false) || v;
            return res;
        }).set(function (v) {
            let res=((this.listDateDur && this.listDateDur[0])?this.listDateDur[0]:false) || v;
            return res;
        });

        let model=app.model.Show || Doc.discriminator("Show", schema);
    
        return model
    }

}
