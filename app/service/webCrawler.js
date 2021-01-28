/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2020-5-11 14:02:45
 */

'use strict';
const path = require('path')
const Service = require('egg').Service;
const Axios = require("axios");
// const Model_NAME=__filename.slice(__dirname.length + 1, -3);

const urlBase="http://192.168.1.202:3000";

class ServicePlugin extends Service {
    // "/search",{keywords:listRes.docs[0].name,type:10}// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
    // res={
    //     status:200,
    //     data:{
    //         code:200
    //         result:{}
    //     }
    // }    
    async api(api,payload){
        try{
            let res=await Axios.get(urlBase+api,{ params:payload,});

            return {
                status:res.data.code,
                data:res.data.result,
                message:res.statusText,
            }
        } catch (err) {
            debugger
            throw new Error(res);
            return err
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
            throw new Error(res);
            return err
        }
    }
}


module.exports = ServicePlugin;
