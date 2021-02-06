/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2021-02-06 10:24:44
 */

'use strict';
const { debug } = require('console');
const path = require('path')
const BaseService = require('./Doc');//require(path.join(process.cwd(), 'lib/plugin/egg-dora-artist/app/service/Artist'));
const shortid = require('shortid');
const _ = require('lodash')
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
    async find(payload, {
        sort = {
            date: -1
        },
        query = {},
        searchKeys = [],
        populate = [],
        files = null
    } = {}) {
        let that=this;
        let res = await super.find(payload, {
            files: files,
            query: query,
            searchKeys: searchKeys,
            populate: !_.isEmpty(populate) ? populate : this.constListPopulate,
            sort: sort
        });
        let listData=res.docs.map(v=>v.toObject());

        for(let idx in listData){
            listData[idx].cntRecords=await that.ctx.service.record.count({
                listRefs:listData[idx]._id
            })
        }
        res.docs=listData;
        return res;
    }
    // 是否使用网易云
    isNCM(idNCM){
        return (idNCM && idNCM!="" && idNCM!="ignore");
    }
    // 检查链接里的id
    findIdInLink(listLinks){
        let idNCM=""
        // 是否有现成的163链接在listLinks;
        if(!(listLinks instanceof Array))return idNCM;
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
    
    //获取网易云音乐id,payload={_id:"",...},idNCM=="ignore"则忽略更新,_id,name,listLinks  任一即可分析，优先使用数据库内的idNCM,
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
            //优先使用listLinks内的网易链接id
            let _id=payload._id || payload.id;
            let name=payload.name;
            let alias=payload.alias;
            let listLinks=(payload.listLinks && payload.listLinks.constructor.name === "CoreDocumentArray")?payload.listLinks.toObject():payload.listLinks;
            let idNCM=this.findIdInLink(listLinks) || payload.idNCM;
            //读取数据库信息 
            if((!idNCM || idNCM=="") && idNCM!="ignore"){
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
                listLinks=(payload.listLinks && payload.listLinks.constructor.name === "CoreDocumentArray")?payload.listLinks.toObject():payload.listLinks;
                _id=payload._id;
                name=payload.name;
                alias=payload.alias;
                idNCM=payload.idNCM;
                // 万一数据库里有，直接返回就好;
                if(idNCM && idNCM!="")return idNCM;
                // 到这里，应该有数据库完整信息了；
                if(listLinks){
                    idNCM=this.findIdInLink(listLinks);
                    // 分析成功，返回结果；是否要自动保存到数据库？
                    if(idNCM && idNCM!="" && _id){
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
                if(listArtists[0].id)idNCM=listArtists[0].id;
                if(_id){
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
        }else{
            return [];
        }
    }
    // 搜索网易云音乐的乐手信息
    // {
    //     code: 200,
    //     message: "ok",
    //     data: {
    //       videoCount: 10,
    //       vipRights: {
    //         rightsInfoDetailDtoList: [
    //           {
    //             vipCode: 220,
    //             expireTime: 1652543999000,
    //             sign: false,
    //             signIap: false,
    //           },
    //           {
    //             vipCode: 100,
    //             expireTime: 1652543999000,
    //             sign: false,
    //             signIap: false,
    //           },
    //         ],
    //         oldProtocol: false,
    //         redVipAnnualCount: 1,
    //       },
    //       identify: {
    //         imageUrl: "https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4874132307/4499/f228/d867/da64b9725e125943ad4e14e4c72d0884.png",
    //         imageDesc: "网易音乐人",
    //         actionUrl: "orpheus://rnpage?component=music-reactnative-artistwiki&artistId=12371",
    //       },
    //       artist: {
    //         id: 12371,
    //         cover: "https://p1.music.126.net/yYudcBFmVRCDdDnGjK5HFQ==/109951164565744552.jpg",
    //         name: "不优雅（biuya）",
    //         transNames: [
    //         ],
    //         identities: [
    //         ],
    //         identifyTag: [
    //           "网易音乐人",
    //         ],
    //         briefDesc: "indie rock band（独立摇滚乐队），来自北京。吉他&主唱张秋爽，贝斯&主唱元帅，鼓手&和声赵九龙。乐队组建于2008年，至今共发表2张专辑和2张EP：2019年EP《人情公园》，2017年专辑 《阴天王国》，2012年专辑 《The Tree Ever Green（常青树）》，2010年EP 《Demo.1》。关注乐队微博（@不优雅乐队-biuya）查收最新动态。",
    //         rank: null,
    //         albumSize: 5,
    //         musicSize: 64,
    //         mvSize: 7,
    //       },
    //       blacklist: false,
    //       preferShow: 7,
    //       showPriMsg: true,
    //       eventCount: 589,
    //       user: {
    //         backgroundUrl: "http://p1.music.126.net/NL5x1X7l3gUih81UEdsnUA==/18657612813467546.jpg",
    //         birthday: 1222185600000,
    //         detailDescription: null,
    //         authenticated: true,
    //         gender: 1,
    //         city: 110101,
    //         signature: "多难兴band。曾用名Mr.Graceless、不优雅先生、不优雅（中文版）、biuya（英文版）。群聊微信16601105464",
    //         description: null,
    //         remarkName: null,
    //         shortUserName: "18910225464",
    //         accountStatus: 0,
    //         locationStatus: 30,
    //         avatarImgId: 109951164565717310,
    //         defaultAvatar: false,
    //         province: 110000,
    //         nickname: "不优雅_biuya",
    //         expertTags: null,
    //         djStatus: 10,
    //         avatarUrl: "http://p1.music.126.net/Xcxv5YJnBOmdyCL8dDg0Bg==/109951164565717309.jpg",
    //         accountType: 1,
    //         authStatus: 1,
    //         vipType: 11,
    //         userName: "1_18910225464",
    //         followed: false,
    //         userId: 3789718,
    //         lastLoginIP: "240e:404:1e20:a3be:fc5f:6dad:44e2:f98b",
    //         lastLoginTime: 1611639423754,
    //         authenticationTypes: 8,
    //         mutual: false,
    //         createTime: 1383289407485,
    //         anchor: false,
    //         authority: 0,
    //         backgroundImgId: 18657612813467544,
    //         userType: 4,
    //         experts: null,
    //         avatarDetail: {
    //           userType: 4,
    //           identityLevel: 1,
    //           identityIconUrl: "https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4874132307/4499/f228/d867/da64b9725e125943ad4e14e4c72d0884.png",
    //         },
    //       },
    //     },
    //   }
    async ncmArtist(payload={}){
        let console=this.logger;
        let idNCM=await this.checkIdNCM(payload);
        if(this.isNCM(idNCM)){
            try{
                let resNCM=await this.ctx.service.webCrawler.api("/artist/detail",{id:idNCM});
                // 万一失去链接，直接返回，不影响
                if(resNCM.error || !resNCM.data || !resNCM.data.artist) throw new Error("webCrawler连接服务器错误,status:"+resNCM.status);
                let artistNCM={
                    idNCM: resNCM.data.artist.id,
                    sImg:resNCM.data.artist.cover,// "https://p1.music.126.net/yYudcBFmVRCDdDnGjK5HFQ==/109951164565744552.jpg",
                    discription:resNCM.data.artist.briefDesc,
                    alias:resNCM.data.artist.transNames[0] || "",
                    comments:"",
                    link:"https://music.163.com/#/artist?id="+resNCM.data.artist.id,
                }
                let resNCMDesc=await this.ctx.service.webCrawler.api("/artist/desc",{id:idNCM});
                // 万一失去链接，直接返回，不影响
                if(resNCMDesc.error || !resNCMDesc.data || !resNCMDesc.data.introduction || !resNCMDesc.data.introduction[0]) {

                }else{
                    debugger;
                    artistNCM.comments=resNCMDesc.data.introduction[0] || "";
                }

                return artistNCM;
            }catch(e){
                debugger
                console.warn("网易云音乐ncmArtist:",e);
                return false;
            }
        }else{
            return false;
        }
    }
    // 搜索网易云音乐的乐手专辑
    // {
    //     status: 200,
    //     data: {
    //         artist: {
    //         img1v1Id: 18686200114669624,
    //         topicPerson: 0,
    //         alias: [
    //         ],
    //         picId: 109951164565744540,
    //         musicSize: 64,
    //         albumSize: 5,
    //         briefDesc: "",
    //         followed: false,
    //         img1v1Url: "https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg",
    //         trans: "",
    //         picUrl: "https://p1.music.126.net/yYudcBFmVRCDdDnGjK5HFQ==/109951164565744552.jpg",
    //         name: "不优雅（biuya）",
    //         id: 12371,
    //         picId_str: "109951164565744552",
    //         img1v1Id_str: "18686200114669622",
    //         },
    //         hotAlbums: [
    //         {
    //             songs: [
    //             ],
    //             paid: false,
    //             onSale: false,
    //             mark: 0,
    //             alias: [
    //             ],
    //             artists: [
    //             {
    //                 img1v1Id: 18686200114669624,
    //                 topicPerson: 0,
    //                 alias: [
    //                 ],
    //                 picId: 0,
    //                 musicSize: 0,
    //                 albumSize: 0,
    //                 briefDesc: "",
    //                 followed: false,
    //                 img1v1Url: "https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg",
    //                 trans: "",
    //                 picUrl: "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
    //                 name: "不优雅（biuya）",
    //                 id: 12371,
    //                 img1v1Id_str: "18686200114669622",
    //             },
    //             ],
    //             copyrightId: 22036,
    //             picId: 109951164564057280,
    //             artist: {
    //             img1v1Id: 18686200114669624,
    //             topicPerson: 0,
    //             alias: [
    //             ],
    //             picId: 109951164565744540,
    //             musicSize: 64,
    //             albumSize: 5,
    //             briefDesc: "",
    //             followed: false,
    //             img1v1Url: "https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg",
    //             trans: "",
    //             picUrl: "https://p1.music.126.net/yYudcBFmVRCDdDnGjK5HFQ==/109951164565744552.jpg",
    //             name: "不优雅（biuya）",
    //             id: 12371,
    //             picId_str: "109951164565744552",
    //             img1v1Id_str: "18686200114669622",
    //             },
    //             briefDesc: "",
    //             publishTime: 1576598400000,
    //             company: "赤瞳音乐/Indie Works",
    //             commentThreadId: "R_AL_3_84154933",
    //             picUrl: "https://p1.music.126.net/Bl-Vag3wpoQE2Ku4PqU-nA==/109951164564057280.jpg",
    //             pic: 109951164564057280,
    //             blurPicUrl: "https://p1.music.126.net/Bl-Vag3wpoQE2Ku4PqU-nA==/109951164564057280.jpg",
    //             companyId: 0,
    //             tags: "",
    //             description: "",
    //             status: 1,
    //             subType: "录音室版",
    //             name: "人情公园",
    //             id: 84154933,
    //             type: "EP/Single",
    //             size: 3,
    //             picId_str: "109951164564057280",
    //         },...
    //         ],
    //         more: false,
    //         code: 200,
    //     },
    //     message: "OK",
    //     }
    async ncmArtistAlbum(payload={}){
        let console=this.logger;
        let idNCM=await this.checkIdNCM(payload);
        if(this.isNCM(idNCM)){
            try{
                let resNCM=await this.ctx.service.webCrawler.api("/artist/album",{id:idNCM});
                // 万一失去链接，直接返回，不影响
                if(resNCM.error || !resNCM.data || !resNCM.data.hotAlbums) throw new Error("webCrawler连接服务器错误,status:"+resNCM.status);
                let resList=resNCM.data.hotAlbums.map(ncm=>({
                    idAlbumNCM: ncm.id,
                    name:ncm.name,
                    alias:ncm.alias[0] || "",
                    dateRelease:ncm.publishTime,
                    sImg:ncm.picUrl,
                    discription:ncm.briefDesc || "网易云音乐无简介",
                    comments:ncm.description || "网易云音乐无描述",
                    // type:ncm.type,//"EP/Single",
                    link:"https://music.163.com/#/album?id="+ncm.id,
                    
                }))
                return resList;
            }catch(e){
                debugger
                console.warn("网易云音乐ncmArtist:",e);
                return [];
            }
        }else{
            return [];
        }
    }

}

module.exports = ServicePlugin;