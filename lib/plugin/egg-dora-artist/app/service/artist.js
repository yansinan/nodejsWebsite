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
        select: 'name _id'
    },

]

class ArtistService extends Service {

    async find(payload, {
        sort = {
            date: -1
        },
        query = {},
        searchKeys = [],
        populate = [],
        files = null
    } = {}) {

        let listdata = _list(this.ctx.model.Artist, payload, {
            files: files,
            query: query,
            searchKeys: searchKeys,
            populate: !_.isEmpty(populate) ? populate : constListPopulate,
            sort: sort
        });

        return listdata;

    }


    async count(params = {}) {
        return _count(this.ctx.model.Artist, params);
    }

    async create(payload) {
        return _create(this.ctx.model.Artist, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, this.ctx.model.Artist, values, key);
    }

    async safeDelete(res, values) {
        return _safeDelete(res, this.ctx.model.Artist, values);
    }

    async update(res, _id, payload) {
        return _update(res, this.ctx.model.Artist, _id, payload);
    }

    async inc(res, _id, payload) {
        return _inc(res, this.ctx.model.Artist, _id, payload);
    }

    async updateMany(res, ids, payload) {
        return _updateMany(res, this.ctx.model.Artist, ids, payload);
    }

    async item(res, {
        query = {},
        populate = [],
        files = null
    } = {}) {
        return _item(res, this.ctx.model.Artist, {
            files: files,
            query: query,
            populate: !_.isEmpty(populate) ? populate : constListPopulate,

        })
    }


}

module.exports = ArtistService;