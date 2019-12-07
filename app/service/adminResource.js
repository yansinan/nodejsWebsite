/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-08-14 16:52:11
 */

'use strict';
const Service = require('egg').Service;

const _ = require('lodash')
const {
    _list,
    _item,
    _count,
    _create,
    _update,
    _removes,
    _safeDelete
} = require('./general');


class AdminResourceService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        files = null
    } = {}) {

        let listdata = _list(this.ctx.model.AdminResource, payload, {
            query: query,
            searchKeys: searchKeys,
            populate: populate,
            files,
            sort: {
                sortId: 1
            }
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this.ctx.model.AdminResource, params);
    }

    async create(payload) {
        return _create(this.ctx.model.AdminResource, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, this.ctx.model.AdminResource, values, key);
    }

    async safeDelete(res, values) {
        return _safeDelete(res, this.ctx.model.AdminResource, values);
    }

    async update(res, _id, payload) {
        return _update(res, this.ctx.model.AdminResource, _id, payload);
    }

    async item(res, params = {}) {
        return _item(res, this.ctx.model.AdminResource, params)
    }


}

module.exports = AdminResourceService;