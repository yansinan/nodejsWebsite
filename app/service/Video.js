/*
 * @Author: dr 
 * @Date: 2021-01-28
 * @Last Modified by: dr
 * @Last Modified time: 2022-03-01 23:53:52
 */

'use strict';
const path = require('path')
const BaseService = require('./Doc');//require(path.join(process.cwd(), 'lib/plugin/egg-dora-artist/app/service/Artist'));
const Service = require('egg').Service;
// const Model_NAME=__filename.slice(__dirname.length + 1, -3);
const _ = require('lodash');
const moment = require("moment");
// 缓存用
const publicDir = (process.cwd() + '/app/public');
const strFolderCache = `${publicDir}/cache`;

const percentDateOfYear=function(inDate){        
    //全年天数;
    let cntDaysFullYear=Math.abs(moment(inDate).startOf("year").diff(moment(inDate).endOf("year"),"days"));
    //当前第几天
    let idxDayOfYear=Math.abs(moment(inDate).startOf("year").diff(moment(inDate),"days"));
    //console.log(this.name || this.title,this.doc,moment(this.date).format("YYYY-MM-DD"),idxDayOfYear,cntDaysFullYear,Math.abs(idxDayOfYear*100/cntDaysFullYear).toFixed(3))
    return Math.abs(idxDayOfYear*100/cntDaysFullYear).toFixed(3);
}
class ServicePlugin extends Service {
    /* constListPopulate=[
        {
            path: 'listRefs',
            select: 'name _id sImg'
        },
        {
            path: 'tags',
            select: 'name _id alias comments'
        },
    
    ] */
    get model(){
        if(!this._model)this._model=this.ctx.model[__filename.slice(__dirname.length + 1, -3)];
        return this._model;
    }
    async count(){
        let that=this;
        let {ctx,service}=this;
        let listArtists=await service.artist.find({
            //filesType:"timelineBar", 
            pageSize: 0,
            isPaging:"0",
            lean:false,
        },{
            query:{listVideos:{$ne: []}},
            files:"listVideos",
            sort:{date:-1},
        });
        let cnt=0;
        listArtists.forEach(artist=>{
            if(!_.isEmpty(artist.listVideos)){
                cnt+=artist.listVideos.length;
            }
        })
        return cnt;
    }
    // 获取所有视频列表，并按时间排序
    async findAll(){
        let that=this;
        let {ctx,service}=this;

        let listArtists=await service.artist.find({
            //filesType:"timelineBar", 
            pageSize: 0,
            isPaging:"0",
            lean:false,
        },{
            query:{listVideos:{$ne: []}},
            files:"_id name alias listVideos",
            sort:{date:-1},
        });
        let listAllDocVideos=[];
        listArtists.forEach(artist=>{
            if(!_.isEmpty(artist.listVideos)){
                artist.listVideos.forEach(objVideo=>{
                    let docVideo={
                        _id:objVideo.link,
                        tags:[

                        ],
                        docAlias:"videos",
                        date:objVideo.date,
                        dateYYYYM:" "+moment(objVideo.date).format("YYYYM"),
                        dateMM:" "+moment(objVideo.date).format("MM"),
                        dateFull:moment(objVideo.date).format("YYYY-MM-DD"),
                        dateTimeline:moment(objVideo.date).format("MM/DD"),
                        nameTimeline:"视频《"+objVideo.name+ "》发布",//objVideo.nameTimeline,
                        name:objVideo.name,
                        sImg:objVideo.urlImg,
                        nameArtist:artist.name,
                        url:objVideo.url,//"/video___"+objVideo.idURL+".html",//objVideo.link,

                        percentDateOfYear:percentDateOfYear(objVideo.date),
                    }
                    //Object.assign(docVideo,objVideo,);
                    listAllDocVideos.push(Object.assign({},docVideo));
                })                
            }
        })
        let listSortedDocs = listAllDocVideos.sort((a,b)=>(b.date-a.date));
        return listSortedDocs;        
    }
    // 查找视频
    async find(yearStart="", {
        sort = {
            date: -1
        },
        query = {},
        searchKeys = [],
        populate = [],
        files = "_id name alias listVideos",
    } = {}) {
        let that=this;
        let {ctx,service}=this;
        // 和serviceTimeline一样，按年查找
        let dateRange=false;
        if(yearStart){
            // 日期范围
            dateRange={}
            // 取最近两年数据
            dateRange.dateEnd=moment(yearStart).endOf("year");
            dateRange.dateStart=moment(yearStart).subtract(2, 'year').endOf("year");
        }

        let listSortedDocs = (await this.service.uploadFiles.cacheJSON(path.join(strFolderCache,'listDocVideos.json'),{tar:this,fun:this.findAll, params:[] },true,true));
        if(dateRange)listSortedDocs=listSortedDocs.filter(docV=>(dateRange &&  moment(docV.date).isBetween(dateRange.dateStart,dateRange.dateEnd)));
        return listSortedDocs;
    }

    // 根据contentId从webcrawl获取&组合单个视频数据
    async item(ctx,{
        query = {},
        populate = [],
        files = null
    } = {}){
        let idNCMMV=query._id;
        const console=this.logger;
        let res=false;
        try{
            if(!idNCMMV)throw new Error("没有idNCMMV");
            res=await this.ncmMV(idNCMMV);
            res.comments=res.desc;
            res.sImg=res.urlImg;//前端使用
            res.dateFull=moment(res.date).format("YYYY-MM-DD"),
            res.urlVideo=await this.ncmURLMV(idNCMMV);
            res.docAlias="videos";
            return res;
        }catch(e){
            debugger
            console.error("错误：视频item",e);
            return "";
        }  
        
    }
    // 再取视频播放地址/mv/url
    // let resNCM=await this.ctx.service.webCrawler.api("/mv/url",{id:idNCMMV});
    // {
    // status: 200,
    // data: {
    //     code: 200,
    //     data: {
    //     id: 10921982,
    //     url: "http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/1762715827/0a98ecc5015fc4d81c757101366cc71b.mp4?wsSecret=61f9b6914d399ec116d4fe168c289b9b&wsTime=1611854677",
    //     r: 720,
    //     size: 47280209,
    //     md5: "",
    //     code: 200,
    //     expi: 3600,
    //     fee: 0,
    //     mvFee: 0,
    //     st: 0,
    //     promotionVo: null,
    //     msg: "",
    //     },
    // },
    // message: "OK",
    // }
    async ncmURLMV(idNCMMV){
        // const console=this.logger;
        try{
            if(!idNCMMV)throw new Error("没有idNCMMV");
            // 优先检索本地文件
            let pathURL="upload/videos/"+idNCMMV+".mp4";
            let isLocal=this.ctx.service.uploadFiles.existsSync(pathURL);
            if(isLocal){
                console.info("video.ncmURLMV：找到本地mp4：",isLocal,pathURL);
                return isLocal;
            }else{
                let resNCM=await this.ctx.service.webCrawler.api("/mv/url",{id:idNCMMV});
                // 万一失去链接，直接返回，不影响
                if(resNCM.error || !resNCM.data.url) throw new Error("webCrawler连接服务器错误,status:"+resNCM.status);
                // 下载mp4到本地
                this.ctx.runInBackground(async () => {
                    console.info("video.ncmURLMV：后台下载mp4：开始",resNCM.data.url);
                    try{
                        let resDownload=await this.ctx.service.webCrawler.download(resNCM.data.url);
                        console.info("video.ncmURLMV：后台下载mp4：完成",resNCM.data.url,resDownload.status);
                        if(resDownload.status==200){
                            let resSave=await this.ctx.service.uploadFiles.saveBinary(pathURL,resDownload.data);//  /app/upload/songs/idSong.mp3
                            console.info("video.ncmURLMV：后台保存mp4：完成：",resSave.url);
                        }else throw new Error("download出错,urlSongNCM:"+resNCM.data.url)       
                    }catch(err){
                        console.error("video.ncmURLMV：后台:错误：",resNCM.data.url,err);
                        debugger
                    }
                });                
                return resNCM.data.url;
            }
        }catch(e){
            debugger
            console.error("ncmURLMV错误",e);
            return "";
        }        
    }
    // 获取 mv 数据
    // 调用例子 : /mv/detail?mvid=5436712
    // {
    //     status: 200,
    //     data: {
    //         id: 10921635,
    //         name: "寄掉的玩笑",
    //         artistId: 12371,
    //         artistName: "不优雅（biuya）",
    //         briefDesc: "",
    //         desc: "",
    //         cover: "http://p1.music.126.net/-15vM2e_TdDwqLPdYye2Sw==/109951164811356149.jpg",
    //         coverId_str: "109951164811356149",
    //         coverId: 109951164811356140,
    //         playCount: 832,
    //         subCount: 3,
    //         shareCount: 1,
    //         commentCount: 5,
    //         duration: 220000,
    //         nType: 0,
    //         publishTime: "2020-03-17",
    //         price: null,
    //         brs: [
    //         {
    //             size: 15059910,
    //             br: 240,
    //             point: 0,
    //         },
    //         {
    //             size: 23594816,
    //             br: 480,
    //             point: 2,
    //         },
    //         {
    //             size: 37828800,
    //             br: 720,
    //             point: 5,
    //         },
    //         ],
    //         artists: [
    //         {
    //             id: 12371,
    //             name: "不优雅（biuya）",
    //             img1v1Url: null,
    //             followed: false,
    //         },
    //         ],
    //         commentThreadId: "R_MV_5_10921635",
    //         videoGroup: [
    //         ],
    //     },
    //     message: "OK",
    // }
    async ncmMV(idNCMMV){
        const console=this.logger;
        try{
            if(!idNCMMV)throw new Error("没有idNCMMV");
            let resNCM=await this.ctx.service.webCrawler.api("/mv/detail",{mvid:idNCMMV});
            // 万一失去链接，直接返回，不影响
            if(resNCM.error || !resNCM.data) throw new Error("webCrawler连接服务器错误,status:"+resNCM.status);
            let res={
                // _id:_id,
                // url:"`/video/${_id}.html`",//,//"https://music.163.com/#/mv?id="+ncmMV.id,
                name:resNCM.data.name,
                type:"link:music.163.com",
                date:new Date(resNCM.data.publishTime),
                idURL:resNCM.data.id,
                status:resNCM.data.status || 1,
                urlImg:resNCM.data.cover,//ncmMV.imgurl,
                urlVideo:"",
                link:"https://music.163.com/#/mv?id="+resNCM.data.id,
                desc:resNCM.data.desc || "",
            }
            // res.desc=res.desc.replace(/^\s*|\s*$/g,"");
            return res;
        }catch(e){
            debugger
            console.error("ncmMV错误",e);
            return false;
        }        
    }
}

module.exports = ServicePlugin;