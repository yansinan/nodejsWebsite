/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2020-5-11 14:02:45
 */

'use strict';
const path = require('path')
const Service = require('egg').Service;
const cheerio = require('cheerio');
const Axios = require("axios");
const https = require('https');
// const Model_NAME=__filename.slice(__dirname.length + 1, -3);

const urlBase="http://192.168.1.202:3000";

class ServicePlugin extends Service {
    async findVideo(targetUrl){
        try{
            let html=await Axios.get(targetUrl,{
                httpsAgent: new https.Agent({  
                    rejectUnauthorized: false,
                }),
                headers: {
                    'Content-Type': 'text/html;charset=utf8'
                },
                responseType:'document',

            });
            
            // let tmp=await Axios({
            //     url:"https://service0.iiilab.com/video/web/yunyinyue",
            //     method:'post',
            //     httpsAgent: new https.Agent({  
            //         rejectUnauthorized: false,
            //     }),
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            //     },
            //     // responseType:'document',
            //     data:{
            //         link: "https://music.163.com/#/mv?id=10921982",
            //         r: "7567338184402079",
            //         s: "983177962",
            //     }
            // });
            // debugger
            if(html.status==200){
                let data=html.data;
                const $ = cheerio.load(data);
                let div=$(".mv");
                let play=$(".play");
                let body=$("div").each(function(i){
                    if(this.attribs.class=="g-bd4 f-cb"){
                        debugger
                    }
                  });
                debugger
                let res2=$("#flash_box").attr("data-flashvars");
                res2.text();
                debugger;
                console.log(res);
                return res;
    
            }

        }catch(err){
            debugger
        }
    }
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
