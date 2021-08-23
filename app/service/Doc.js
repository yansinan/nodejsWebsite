/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2021-08-23 08:54:17
 */

'use strict';
const path = require('path')
// const BaseService = require(path.join(process.cwd(), 'lib/plugin/egg-dora-artist/app/service/Artist'));

// const Model_NAME=__filename.slice(__dirname.length + 1, -3);
const Service = require('egg').Service;
const _ = require('lodash')

// const Model_NAME=__filename.slice(__dirname.length + 1, -3);

// general是一个公共库，可用可不用
const {
    _list,
    _item,
    _count,
    _create,
    _update,
    _removes,
    _safeDelete,
    _updateMany,
    _inc,
} = require('./general');

class ServicePlugin extends Service {
    // 相关查询模板
    constListPopulate=[
        {
            path: 'listRefs',
            select: 'name _id sImg'
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
        //let {
        //    current,
        //    pageSize,
        //    searchkey,
        //    isPaging,
        //    skip,
        //    lean
        //} = payload;    
        // pageSize==0,说明要读全部；pageSize未定义，默认改取30
        // if(payload.pageSize!=0)payload.pageSize = Number(payload.pageSize) || 30;
        // isPaging = isPaging == '0' ? false : true;

        let listdata = _list(this.model, payload, {
            files: files,
            query: query,
            searchKeys: searchKeys,
            populate: !_.isEmpty(populate) ? populate : this.constListPopulate,
            sort: sort
        });

        return listdata;

    }


    async count(params = {}) {
        return _count(this.model, params);
    }

    async create(payload) {
        return _create(this.model, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, this.model, values, key);
    }

    async safeDelete(res, values) {
        return _safeDelete(res, this.model, values);
    }

    async update(res, _id, payload) {
        let isAtomic=false;
        // 检查是否有原子操作;
        for(let k in payload){
            // $命令都添加
            if(k.indexOf("$")==0) isAtomic=true;
        }
        return isAtomic?this.updateAllowAtomic(res, _id, payload):_update(res, this.model, _id, payload);
    }
    async updateAllowAtomic(ctx, _id, payload, query = {}) {
        if (_id) {
            query = _.assign({}, query, {
                _id: _id
            });
        } else {
            if (_.isEmpty(query)) {
                throw new Error(ctx.__('validate_error_params'));
            }
        }    
        return await this.model.findOneAndUpdate(query, payload);
    }
    async inc(res, _id, payload) {
        return _inc(res, this.model, _id, payload);
    }

    async updateMany(res, ids, payload) {
        return _updateMany(res, this.model, ids, payload);
    }

    async item(res, {
        query = {},
        populate = [],
        files = null
    } = {}) {
        return _item(res, this.model, {
            files: files,
            query: query,
            populate: !_.isEmpty(populate) ? populate : this.constListPopulate,

        })
    }
}

module.exports = ServicePlugin;