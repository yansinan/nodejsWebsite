/*
 * @Author: dr 
 * @Date: 2021-01-28 04:34:44 
 * @Last Modified by: dr
 * @Last Modified time: 2021-01-29 08:50:08
 */


'use strict';
const path = require('path')
const Service = require('egg').Service;
const Axios = require("axios");
// const Model_NAME=__filename.slice(__dirname.length + 1, -3);

class ServicePlugin extends Service {
    // let tmp=await ctx.service.webCrawler.api("/search",{keywords:listRes.docs[0].name,type:10});
    // "/search",{keywords:listRes.docs[0].name,type:10}// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
    // res={
    //     status:200,
    //     data:{
    //         code:200
    //         result:{}
    //     }
    // }    
    async api(api,payload){
        let console=this.logger;

        let res={};
        try{
            if(!api)throw new Error({api});
            res=await Axios.get(this.app.config.server_neteaseCloudMusicApi+api,{ params:payload,});
            console.warn("跨域网络请求:网易云音乐",api,res.status,res.data);
            if(res.status!=200 || !res.data ) throw new Error("webCrawler连接服务器错误,status:"+res.status);
            return {
                status:res.data.code,
                data:res.data.result || res.data,
                message:res.statusText,
            }
        } catch (err) {
            debugger
            console.warn("网易云音乐:api.webCrawler:",err);
            res.error=err;
            return res;
        }
    }
    // keywords:listRes.docs[0].name,type:10
    // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
    // let tmp=await ctx.service.webCrawler.findVideo("https://music.163.com/#/mv?id=10921982");
    // let tmp=await ctx.service.webCrawler.search({keywords:listRes.docs[0].name,type:10});
    // debugger    
    async search(payload){
        try{
            return this.api("/search",payload);
        } catch (err) {
            debugger
            return err
        }
    }
}


module.exports = ServicePlugin;
