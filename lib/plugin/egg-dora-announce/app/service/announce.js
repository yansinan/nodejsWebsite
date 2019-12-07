/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-09-26 13:20:28
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
    _safeDelete
} = require(path.join(process.cwd(), 'app/service/general'));


class AnnounceService extends Service {

    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        files = null
    } = {}) {

        let listdata = _list(this.ctx.model.Announce, payload, {
            query: query,
            searchKeys: searchKeys,
            populate: populate,
            files
        });
        return listdata;

    }


    async count(params = {}) {
        return _count(this.ctx.model.Announce, params);
    }

    async create(payload) {
        return _create(this.ctx.model.Announce, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, this.ctx.model.Announce, values, key);
    }

    async safeDelete(res, values) {
        return _safeDelete(res, this.ctx.model.Announce, values);
    }

    async update(res, _id, payload) {
        return _update(res, this.ctx.model.Announce, _id, payload);
    }

    async item(res, params = {}) {
        return _item(res, this.ctx.model.Announce, params)
    }


}

module.exports = AnnounceService;