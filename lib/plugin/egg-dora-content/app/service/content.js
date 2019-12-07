/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-09-25 17:39:54
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

class ContentService extends Service {

    async find(payload, {
        sort = {
            updateDate: -1
        },
        query = {},
        searchKeys = [],
        populate = [],
        files = null
    } = {}) {

        let listdata = _list(this.ctx.model.Content, payload, {
            files: files,
            query: query,
            searchKeys: searchKeys,
            populate: !_.isEmpty(populate) ? populate : [{
                    path: 'author',
                    select: 'userName _id id logo'
                },
                {
                    path: 'uAuthor',
                    select: 'userName name logo _id group'
                },
                {
                    path: 'tags',
                    select: 'name _id'
                },
                {
                    path: 'categories',
                    select: 'name _id contentTemp enable defaultUrl',
                    populate: {
                        path: 'contentTemp'
                    }
                }
            ],
            sort: sort
        });

        return listdata;

    }


    async count(params = {}) {
        return _count(this.ctx.model.Content, params);
    }

    async create(payload) {
        return _create(this.ctx.model.Content, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, this.ctx.model.Content, values, key);
    }

    async safeDelete(res, values) {
        return _safeDelete(res, this.ctx.model.Content, values);
    }

    async update(res, _id, payload) {
        return _update(res, this.ctx.model.Content, _id, payload);
    }

    async inc(res, _id, payload) {
        return _inc(res, this.ctx.model.Content, _id, payload);
    }

    async updateMany(res, ids, payload) {
        return _updateMany(res, this.ctx.model.Content, ids, payload);
    }

    async item(res, {
        query = {},
        populate = [],
        files = null
    } = {}) {
        return _item(res, this.ctx.model.Content, {
            files: files,
            query: query,
            populate: !_.isEmpty(populate) ? populate : [{
                    path: 'author',
                    select: 'userName _id id logo'
                },
                {
                    path: 'uAuthor',
                    select: 'userName name logo _id group'
                },
                {
                    path: 'tags',
                    select: 'name _id'
                },
                {
                    path: 'categories',
                    select: 'name _id contentTemp enable defaultUrl',
                    populate: {
                        path: 'contentTemp'
                    }
                }
            ],

        })
    }


}

module.exports = ContentService;