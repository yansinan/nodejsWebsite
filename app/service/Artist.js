/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2021-01-29 04:34:05
 */

'use strict';
const { debug } = require('console');
const path = require('path')
const BaseService = require('./Doc');//require(path.join(process.cwd(), 'lib/plugin/egg-dora-artist/app/service/Artist'));
const shortid = require('shortid');

// const Model_NAME=__filename.slice(__dirname.length + 1, -3);


class ServicePlugin extends BaseService {
    // 相关查询模板
    constListPopulate=[
        {
            path: 'listMembers',
            select: 'userName _id id logo'
        },
        {
            path: 'tags',
            select: 'name _id alias comments'
        },
    
    ]
    get model(){
        if(!this._model)this._model=this.ctx.model[__filename.slice(__dirname.length + 1, -3)];
        return this._model;
    }
    // 是否使用网易云
    isNCM(idNCM){
        return (idNCM && idNCM!="" && idNCM!="ignore");
    }
    // 检查链接里的id
    findIdInLink(listLinks){
        let idNCM=""
        // 是否有现成的163链接在listLinks;
        if(!(typeof listLinks === Array))return idNCM;
        try{
            let objLink=listLinks.find(v=>(v.url.indexOf("music.163.com")!=-1));            
            if(objLink){
                idNCM=objLink.url.split("artist?id=")[1] || "";//https://music.163.com/#/artist?id=12371
            }
        }catch(e){
            return idNCM;
        }

        return idNCM
    }
    
    //获取网易云音乐id,payload={_id:"",...},idNCM=="ignore"则忽略更新
    // _id,name,listLinks  任一即可分析，优先使用数据库内的idNCM,
    // let resNCM=await this.ctx.service.webCrawler.api("/cloudsearch",{keywords:name,type:100});
    // {
    //     status: 200,
    //     data: {
    //       artistCount: 1,
    //       artists: [
    //         {
    //           id: 12371,
    //           name: "不优雅（biuya）",
    //           picUrl: "https://p1.music.126.net/yYudcBFmVRCDdDnGjK5HFQ==/109951164565744552.jpg",
    //           alias: [
    //           ],
    //           albumSize: 5,
    //           picId: 109951164565744540,
    //           img1v1Url: "https://p1.music.126.net/f5D_J6Sk1KRsZEvfRPSL4g==/109951164565740208.jpg",
    //           accountId: 3789718,
    //           img1v1: 109951164565740210,
    //           mvSize: 7,
    //           followed: false,
    //           trans: null,
    //         },
    //       ],
    //     },
    //     message: "OK",
    //   }
    async checkIdNCM(payload={}){
        let console=this.logger;
        try{
            let idNCM=payload.idNCM;
            //读取数据库信息 
            if((!idNCM || idNCM=="") && idNCM!="ignore"){
                let listLinks=(payload.listLinks.constructor.name === "CoreDocumentArray")?payload.listLinks.toObject():payload.listLinks;
                let _id=payload._id || payload.id;
                let name=payload.name;
                let alias=payload.alias;
                // 如果更新过listLinks,尝试检查;
                if(!listLinks){
                    // 没有listLinks，搜索数据库开始用artist.name手动搜索
                    // 优先按_id查找，其次name，_id,name,listLinks都没有,真没辙
                    if(!name && _id){//没name，但是有id可以通过数据库检索name
                        let data=await this.item(this.ctx,{query:{_id:_id},files:"_id name listLinks idNCM"})
                        Object.assign(payload,data);
                    }else if(!_id){//有name 没id
                        let data=await this.item(this.ctx,{query:{name:name},files:"_id name listLinks idNCM"})
                        Object.assign(payload,data);
                        
                    }else throw new Error("_id,name,listLinks都没有,真没辙");
                }
                listLinks=(payload.listLinks.constructor.name === "CoreDocumentArray")?payload.listLinks.toObject():payload.listLinks;
                _id=payload._id;
                name=payload.name;
                alias=payload.alias;
                idNCM=payload.idNCM;
                // 万一数据库里有，直接返回就好;
                if(idNCM && idNCM!="")return idNCM;
                // 到这里，应该有数据库完整信息了；
                if(listLinks){
                    this.findIdInLink(listLinks);
                    // 分析成功，返回结果；是否要自动保存到数据库？
                    if(idNCM && idNCM!=""){
                        let resUpdate=await this.update(this.ctx,_id,{idNCM});
                        console.warn("idNCM网络请求:","乐手获取到idNCM,自动保存结果:",idNCM);
                        return idNCM;
                    }
                }
                // 只能按name查找
                let resNCM=await this.ctx.service.webCrawler.api("/cloudsearch",{keywords:name,type:100});
                // 万一失去链接，直接返回，不影响
                if(resNCM.error || resNCM.data.artistCount==0) throw new Error("webCrawler服务器返回结果错误,status:"+resNCM.status);

                let listArtists=resNCM.data.artists;
                // 双验证
                // let listArtistAlias=listArtists.filter(v=>(v.name.indexOf(alias)!=-1));
                // 默认第一个的id
                if(listArtists[0].id){
                    idNCM=listArtists[0].id;
                    let resUpdate=await this.update(this.ctx,_id,{idNCM});
                    console.warn("idNCM网络请求:","乐手获取到idNCM,自动保存结果:",idNCM);
                }
                return idNCM;
            }else{
                if(idNCM=="ignore")throw new Error("idNCM已设置为忽略ignore")
                return idNCM;
            }
    
        }catch(e){
            debugger
            console.warn("网易云音乐checkIdNCM:",e);
            return "";
        }
    }
    // let resNCM=await this.ctx.service.webCrawler.api("/artist/mv",{id:idNCM});
    // {
    //     status: 200,
    //     data: {
    //       mvs: [
    //         {
    //           id: 10921982,
    //           name: "License to capture",
    //           status: 0,
    //           imgurl16v9: "http://p1.music.126.net/GEu4H2GPke4J75G8Dgp9dQ==/109951164821105661.jpg",
    //           artist: {
    //             img1v1Id: 18686200114669624,
    //             topicPerson: 0,
    //             img1v1Url: "http://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg",
    //             trans: "",
    //             picUrl: "http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
    //             albumSize: 0,
    //             briefDesc: "",
    //             alias: [
    //             ],
    //             musicSize: 0,
    //             picId: 0,
    //             name: "不优雅（biuya）",
    //             id: 12371,
    //             img1v1Id_str: "18686200114669622",
    //           },
    //           imgurl: "http://p1.music.126.net/ylsluE71b6Z7NAfCHjrMUw==/109951164821097490.jpg",
    //           artistName: "不优雅（biuya）",
    //           duration: 283000,
    //           playCount: 674,
    //           publishTime: "2020-03-20",
    //           subed: false,
    //         },...
    //       ],
    //       time: 1423152000007,
    //       hasMore: false,
    //       code: 200,
    //     },
    //     message: "OK",
    //   }
    // 某乐队的MV
    async ncmListArtistMV(payload={}){
        let console=this.logger;

        let idNCM=await this.checkIdNCM(payload);
        if(this.isNCM(idNCM)){
            try{
                let resNCM=await this.ctx.service.webCrawler.api("/artist/mv",{id:idNCM});
                // 万一失去链接，直接返回，不影响
                if(resNCM.error || !resNCM.data.mvs) throw new Error("webCrawler连接服务器错误,status:"+resNCM.status);
                let listMVs=resNCM.data.mvs.map(ncmMV=>{
                    // let _id=shortid.generate();
                    return {
                        // _id:_id,
                        // url:"`/video/${_id}.html`",//,//"https://music.163.com/#/mv?id="+ncmMV.id,
                        name:ncmMV.name,
                        type:"link:music.163.com",
                        date:new Date(ncmMV.publishTime),
                        idURL:ncmMV.id,
                        status:ncmMV.status,
                        urlImg:ncmMV.imgurl16v9,//ncmMV.imgurl,
                        urlVideo:"",
                        link:"https://music.163.com/#/mv?id="+ncmMV.id,
                    }
                })
                return listMVs;
            }catch(e){
                debugger
                console.warn("网易云音乐ncmListArtistMV:",e);
                return [];
            }
        }

    }


}

module.exports = ServicePlugin;