/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2020-5-11 14:02:45
 */

'use strict';
const Service = require('egg').Service;
const path = require('path')
const _ = require('lodash')
const pluginInfo = require('../../package.json').eggPlugin;

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
} = require(path.join(process.cwd(), 'app/service/general'));

const constListPopulate=[
    {
        path: 'listMembers',
        select: 'userName _id id logo'
    },
    {
        path: 'tags',
        select: 'name _id alias comments'
    },

]

class ServicePlugin extends Service {
    get model(){
        return this.ctx.model[pluginInfo.model];
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

        let listdata = _list(this.model, payload, {
            files: files,
            query: query,
            searchKeys: searchKeys,
            populate: !_.isEmpty(populate) ? populate : constListPopulate,
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
        return _update(res, this.model, _id, payload);
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
            populate: !_.isEmpty(populate) ? populate : constListPopulate,

        })
    }


}

module.exports = ServicePlugin;