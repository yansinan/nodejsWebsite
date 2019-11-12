/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-07-27 14:02:45
 */


'use strict';

const {
    Artist
} = require('../models/index');
const _ = require('lodash')
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

class ArtistService {

    async find(payload, {
        sort = {
            date: -1
        },
        query = {},
        searchKeys = [],
        populate = [],
        files = null
    } = {}) {

        let listdata = _list(Artist, payload, {
            files: files,
            query: query,
            searchKeys: searchKeys,
            populate: !_.isEmpty(populate) ? populate : constListPopulate,
            sort: sort
        });

        return listdata;

    }


    async count(params = {}) {
        return _count(Artist, params);
    }

    async create(payload) {
        return _create(Artist, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, Artist, values, key);
    }

    async safeDelete(res, values) {
        return _safeDelete(res, Artist, values);
    }

    async update(res, _id, payload) {
        return _update(res, Artist, _id, payload);
    }

    async inc(res, _id, payload) {
        return _inc(res, Artist, _id, payload);
    }

    async updateMany(res, ids, payload) {
        return _updateMany(res, Artist, ids, payload);
    }

    async item(res, {
        query = {},
        populate = [],
        files = null
    } = {}) {
        return _item(res, Artist, {
            files: files,
            query: query,
            populate: !_.isEmpty(populate) ? populate : defaultListPopulate,

        })
    }


}

module.exports = new ArtistService();