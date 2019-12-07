/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-07-27 14:02:45
 */


'use strict';

const {
    Content
} = require('../models/index');
const Model=Content;
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

const constListPopulate=[{
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
]

class Service {
    // 构造
    constructor(inModel,inListPopulate=constListPopulate){
        this._model=inModel;
        this._listPopulate=inListPopulate;
        this.Service=Service;
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

        let listdata = _list(Model, payload, {
            files: files,
            query: query,
            searchKeys: searchKeys,
            populate: !_.isEmpty(populate) ? populate : this._listPopulate,
            sort: sort
        });

        return listdata;

    }


    async count(params = {}) {
        return _count(Model, params);
    }

    async create(payload) {
        return _create(Model, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, Model, values, key);
    }

    async safeDelete(res, values) {
        return _safeDelete(res, Model, values);
    }

    async update(res, _id, payload) {
        return _update(res, Model, _id, payload);
    }

    async inc(res, _id, payload) {
        return _inc(res, Model, _id, payload);
    }

    async updateMany(res, ids, payload) {
        return _updateMany(res, Model, ids, payload);
    }

    async item(res, {
        query = {},
        populate = [],
        files = null
    } = {}) {
        return _item(res, Model, {
            files: files,
            query: query,
            populate: !_.isEmpty(populate) ? populate : this._listPopulate,

        })
    }


}

module.exports = new Service(Model,constListPopulate);