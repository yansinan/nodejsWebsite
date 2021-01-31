/*
 * @Author: dr 
 * @Date: 2021-01-28
 * @Last Modified by: dr
 * @Last Modified time: 2021-01-31 08:18:44
 */

'use strict';
const path = require('path')
const BaseService = require('./Doc');//require(path.join(process.cwd(), 'lib/plugin/egg-dora-artist/app/service/Artist'));
const Service = require('egg').Service;
// const Model_NAME=__filename.slice(__dirname.length + 1, -3);


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
        try{
            if(!idNCMMV)throw new Error("没有idNCMMV");
            let resNCM=await this.ctx.service.webCrawler.api("/mv/url",{id:idNCMMV});
            // 万一失去链接，直接返回，不影响
            if(resNCM.error || !resNCM.data.url) throw new Error("webCrawler连接服务器错误,status:"+resNCM.status);
            return resNCM.data.url;
        }catch(e){
            debugger
            console.warn("ncmURLMV错误",e);
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
            }
            return res;
        }catch(e){
            debugger
            console.warn("ncmMV错误",e);
            return false;
        }        
    }
}

module.exports = ServicePlugin;