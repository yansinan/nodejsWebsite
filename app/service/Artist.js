/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2020-5-11 14:02:45
 */

'use strict';
const { debug } = require('console');
const path = require('path')
const BaseService = require('./Doc');//require(path.join(process.cwd(), 'lib/plugin/egg-dora-artist/app/service/Artist'));

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
    //获取网易云音乐id,payload={_id:"",...},idNCM=="ignore"则忽略更新
    // _id,name,listLinks  任一即可分析，优先使用数据库内的idNCM,
    async checkIdNCM(payload={}){
        try{
            let idNCM=payload.idNCM;
            //读取数据库信息 
            if((!idNCM || idNCM=="") && idNCM!="ignore"){
                debugger
                let listLinks=(payload.listLinks.constructor.name === "CoreDocumentArray")?payload.listLinks.toObject():payload.listLinks;
                let _id=payload._id || payload.id;
                let name=payload.name;
                let alias=payload.alias;
                // 如果更新过listLinks,尝试检查;
                if(!listLinks){
                    // 没有listLinks，搜索数据库开始用artist.name手动搜索
                    // 优先按_id查找，其次name，_id,name,listLinks都没有,真没辙
                    if(!name && _id){//没name，但是有id可以通过数据库检索name
                        let data=await this.item(this.ctx,{query:{_id:_id,files:"_id name listLinks idNCM"}})
                        Object.assign(payload,data);
                    }else if(!_id){//有name 没id
                        let data=await this.item(this.ctx,{query:{name:name,files:"_id name listLinks idNCM"}})
                        Object.assign(payload,data);
                        
                    }else return idNCM;
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
                    // 是否有现成的163链接在listLinks;
                    let objLink=listLinks.find(v=>(v.url.indexOf("music.163.com")!=-1));            
                    if(objLink){
                        idNCM=objLink.url.split("artist?id=")[1] || "";//https://music.163.com/#/artist?id=12371
                    }
                    // 分析成功，返回结果；是否要自动保存到数据库？
                    if(idNCM && idNCM!=""){
                        let resUpdate=await this.update(this.ctx,_id,{idNCM});
                        console.warn("idNCM网络请求:","乐手获取到idNCM,自动保存结果:",idNCM);
                        return idNCM;
                    }
                }
                // 只能按name查找
                let resNCM=await this.ctx.service.webCrawler.api("/cloudsearch",{keywords:name,type:100});
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
                // 万一失去链接，直接返回，不影响
                if(resNCM.status!=200 || !resNCM.data || resNCM.data.artistCount==0)return idNCM;
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
                return idNCM;
            }
    
        }catch(e){
            debugger
        }
    }

    
}

module.exports = ServicePlugin;