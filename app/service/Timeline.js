/*
 * @Author: dr 
 * @Date: 2021-08-04 05:26:38 
 * @Last Modified by: dr
 * @Last Modified time: 2021-08-12 21:01:22
 */
'use strict';
const { debug } = require('console');
const Service = require('egg').Service;
//const _ = require('lodash')
// const Model_NAME=__filename.slice(__dirname.length + 1, -3);
const moment = require('moment')
const shortid = require('shortid');
// 缓存用
const fs = require('fs');
const path = require('path');

const docTemplate={// 生成文档种子
        
    _id:'EXxamHvLe',
    alias:'Click#15 X Rustic平安夜专场正式开票',
    date:'2021-01-15',
    dateTimeline:'01-15',
    dateYear:'2021 ',
    discription:'我们给这场演出取名“Two Sides，One Man”是的这场演出由Ricky而来但它不仅是一个拼场演出还浓缩了一段跨越十年爱恨交织的旧事12月24日杭州大麦66Live两个Ricky人生中最重要的乐队将在这一天同台他的过去与现在也将在这一天这个舞台上重叠',
    hasComment:false,
    hasDespise:false,
    hasFavorite:false,
    hasPraised:false,
    id:'EXxamHvLe',
    name:'Click#15 X Rustic平安夜专场正式开票',
    sImg:'/static/upload/images/20210115/1610679221136585273.jpg',
    strCate:'details',
    strCateTip:'消息',
    // tags:(1) [{…}],
    url:'/details/EXxamHvLe.html',
    widthTemp:10,
}

class ServicePlugin extends Service {
    async getDoc(yearStart=""){
        let {ctx,service}=this;
        let query={
            state: '2',
        }
        // 日期范围
        let dateRange={};
        if(yearStart){
            // 取最近两年数据
            dateRange.dateEnd=moment(yearStart).startOf("year").toDate();
            dateRange.dateStart=moment(yearStart).subtract(1, 'year').startOf("year").toDate();
            query.date= {
                "$gte": new Date(dateRange.dateStart),
                "$lte": new Date(dateRange.dateEnd)
            }
        }
        try{
            let listDate=await service.doc.find(
                {
                    //filesType:"timelineBar", 
                    pageSize: 0,
                    isPaging:"0",
                },{
                    query,
                    files:"_id date dateYear dateYYYYM dateTimeline name alias sImg tags url",
                    populate:[{
                        path: 'tags',
                        select: 'name _id alias comments'
                    }],
                    sort:{date: -1},
                });
            return listDate;
        }catch(e){
            console.error("doc.find获取失败",query);
            throw new Error({msg:"doc.find获取失败",query});
            return e;
        }

    }
    // 按年生成伪数据
    getTestDateByYear(dateStart,dateEnd){
        let objTimeline=false;
        
        let timeLast=dateStart ? new Date(dateStart) : new Date().getTime();
        // 起始日期
        let dateFirst=timeLast;//dateStart ? moment(dateStart).endOf("year").toDate() : new Date(timeLast);
        // 起始日期的全年（后面日期只增加季度、年份、长度）
        //let dateFirstYearEnd=moment(dateFirst).add(1,"year").startOf("year").toDate();
        // 终止日期;优先用传入参数，没有自动计算当年元旦；再没有取2019/1/1
        let dateLast=dateEnd ? new Date(dateEnd) : (dateStart ? moment(dateStart).startOf("year").toDate() : new Date("2019/1/1"));//new Date("2018/07/01");
        //全年天数;
        let cntDaysFullYear=Math.abs(moment(dateLast).diff(moment(dateStart).endOf("year"),"days"));
        //生成概率:越小越小,初始500
        let factor=8*12;//150;//500;
        // 随机日期间隔（日）
        let diffDays=20;//5;
        

        //let timeRange=dateFirst.getTime()-dateLast.getTime();
        let cntDays=moment(dateFirst).diff(moment(dateLast).startOf("year"),"days");//Math.round(timeRange/(1000*60*60*24));
        // 生成全部日期数组
        let listTmpYearDocs=[]
        // let listIdxDaysGroup=[];
        // let lastYear=dateFirst.getFullYear();
        let listIdxDays=[];
        let listDateAll=[];
        let listIdxYears=[];
        let listIdxSeasons=[];
        for(let i=0 ;i<cntDays;i++){
            // let dateTmp=new Date(dateFirst);
            // dateTmp.setTime(dateTmp.setDate(dateTmp.getDate()-i));
            let dateTmp=moment(dateFirst).subtract(i, 'days').toDate();
            let posX=(i*100/cntDays).toFixed(3);
            // let date=timeLast-Math.floor(Math.random()*1000*60*60*24*5);
            if(Math.random()<(factor/cntDays) && timeLast>dateTmp){
                // let date=timeLast-Math.floor(Math.random()*1000*60*60*24*diffDays);
                let date=dateTmp;//moment(dateTmp).subtract(Math.floor((Math.random())*diffDays),"days").toDate();
                listIdxDays.push(posX);
                listDateAll.push(date);
                timeLast=new Date(date).getTime();
                //// 添加到年份组
                //let nowYear=date.getFullYear();
                //if(listIdxDaysGroup.length==0 || listIdxDaysGroup[listIdxDaysGroup.length-1].year!=nowYear){
                //    listIdxDaysGroup.push({
                //        year:lastYear,
                //        listIdxDocs:[posX],
                //        objYear:{x:posX,strTitle:nowYear},
                //    })
                //    lastYear=nowYear;
                //}else{
                //    listIdxDaysGroup.findIndex()
                //}
                listTmpYearDocs.push({
                    posX,
                    date:moment(date).format("YYYY-MM-DD")
                });
            }
            
            let m=dateTmp.getMonth()+1;

            let isSeasonEnd=moment(dateTmp).startOf('quarter').isSame(moment(dateTmp),"date");
            // if(m%3==0 && dateTmp.getDate()==lastDateInMonth && m!=12){
            if(isSeasonEnd){
                listIdxSeasons.push({x:posX,strTitle:m+"月"});
            }
            let isNewYear=moment(dateTmp).isSame(moment(dateTmp).startOf("year"),"date");
            // 如果最后日期在元旦之前，补加当年元旦
            let isLastDateBeforeNewYear=(i >= cntDays-1) && moment(dateTmp).isAfter(moment(dateTmp).startOf("year"),"date");
            if(isNewYear || isLastDateBeforeNewYear){
                let objDetailYear={
                    x:posX,
                    "width-year":listIdxYears.length==0?posX:posX-listIdxYears[listIdxYears.length-1].x,
                    strTitle:dateTmp.getFullYear(),
                    listIdxDocs:listTmpYearDocs.concat(),
                };
                listIdxSeasons.push(objDetailYear);
                listIdxYears.push(objDetailYear);
                // 添加到日期按年分组
                // listIdxDaysGroup.findIndex((idx,v)=>{
                    // if(v.year==dateTmp.getFullYear()+1){
                        // listIdxDaysGroup[idx].objYear=objDetailYear;
                    // }
                // })
                listTmpYearDocs=[];
                
            }
        }
        objTimeline={
            listIdxDays,
            listIdxSeasons,
            listIdxYears,
            dateFirst,
            dateLast,
            cntDays,
            widthPercent:cntDays/cntDaysFullYear,//不满一年的情况下，天数占365的百分比。//(100/listIdxDays.length).toFixed(1),
            listDateAll,
        }
        return objTimeline;
    }
    async getTestDate(isRandom=false){
        let {ctx}=this;
        let objTimeline=false;
        let listDateYear=[];
        // 尝试读取缓存数据
        const publicDir = (process.cwd() + '/app/public');
        let strFolderCache = `${publicDir}/cache`;
        let strFileName="objTestDataTimeline.json";
        if(!isRandom){            
            if (!fs.existsSync(strFolderCache)) {
                fs.mkdirSync(strFolderCache,{recursive: true});
            }
            // 同步读取
            listDateYear = JSON.parse(fs.readFileSync(path.join(strFolderCache,strFileName), 'utf-8'));
        }
        if(isRandom || !listDateYear || listDateYear.length==0){// 如果随机生成，或者没有缓存
            let dateStart=new Date();
            let dateRange={};
            let listYear=[dateStart,moment(dateStart).subtract(1, 'year').endOf("year").toDate()];//一次取两年
            // 取最近两年数据
            listDateYear=listYear.map(dateEndOfYear=>{
                let objTimeline = this.getTestDateByYear(dateEndOfYear);
                return objTimeline;
            })    
            // 写入缓存目录
            let data = fs.writeFileSync(path.join(strFolderCache,strFileName), JSON.stringify(listDateYear));
        }

        let pageInfo={            
            current:1,
            itemTemplate:'timeline',
            pageSize:10,
            searchkey:'',
            state:'2',
            totalItems:12,
            totalPage:2,
        }
        
        Object.assign(pageInfo,{current:0,totalPage:1})
        return {pageInfo,listDateYear};
    }
    // 获取虚拟docs
    async find(payload){
        let listDocs=[];
        try{
            listDocs=await this.getDoc(payload.yearStart || new Date());
            listDocs=await this.getTestDocs(false,listDocs);
        }catch(e){
            throw(new Error(e));
        }
        return listDocs
    }

    getTestDoc(date,listImg,listTagsAll){
        let _id=shortid.generate();
        let idxSubstring=Math.floor(Math.random()*docTemplate.discription.length)
        let title=docTemplate.discription.substring(idxSubstring,idxSubstring+10+Math.round(Math.random()*20));
        
        // 标签
        let idxStart=Math.floor(Math.random()*(listTagsAll.length));
        let idxRange=Math.min(listTagsAll.length-idxStart,3);
        let idxEnd=idxStart+2+Math.floor(Math.random()*idxRange);
        let listTags=listTagsAll.slice(idxStart,idxEnd);
        let docTest={
            _id:_id,
            id:_id,
            alias:title,
            name:title,
            sImg:listImg[Math.floor(Math.random()*listImg.length)],
            date:moment(date).format("YYYY-MM-DD"),
            dateYear:moment(date).format("YYYY"),
            //dateYYMM:" "+moment(date).format("YYYYM"),
            dateYYYYM:" "+moment(date).format("YYYYM"),
            dateMM:" "+moment(date).format("M月"),
            dateTimeline:moment(date).format("MM/DD"),
            tags:listTags,
        }
        return docTest;
    }
    async getTestDocs(isRandom,listDocs){
        let {ctx}=this;
        let {pageInfo,listDateYear}=await this.getTestDate(isRandom);


        let docs=[];

        // 随机图片
        let listImg=this.ctx.service.uploadFiles.listUrlImg();
        // 获取所有标签，给docs用
        //let listTagsAll=await ctx.service.contentTag.find({isPaging: '0'});
        //listTagsAll=JSON.parse(JSON.stringify(listTagsAll));
        // 人物（艺术家）列表
        let listTagsAll= (await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/listTags.json`,{tar:this,fun:ctx.service.contentTag.find, params:['artist/getList', {pageSize: 0,isPaging:"0",}] },true,true)).docs;

        listDateYear.forEach(objTimeline=>{
            for(let i=0 ; i<objTimeline.listIdxDays.length;i++){
                //时间轴日期
                let date=new Date(objTimeline.listDateAll[i]);
                //按日期找出数据库文档
                let listDocsFind=listDocs.filter(doc=>(moment(doc.date).isSame(date,"day")));
                let listDocsToAdd=listDocsFind;
                //数据库没有则虚拟文档            
                if(listDocsToAdd.length==0)listDocsToAdd.push(this.getTestDoc(date,listImg,listTagsAll));
                else console.log(listDocsToAdd,[this.getTestDoc(date,listImg,listTagsAll)],date);
                docs.push(...listDocsToAdd);
            }
        })

        return {docs,pageInfo,listDateYear}
    }
}

module.exports = ServicePlugin;