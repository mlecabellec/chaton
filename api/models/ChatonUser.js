/**
 * ChatonUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var cryptoJS = require("crypto-js");

module.exports = {
    attributes: {
        username: {type: 'string', size: 64, minLength: 4, unique: true, primaryKey: true},
        password: {type: 'string', size: 180, required: true, protected: true},
        sessionkey: {type: 'string', size: 180, required: true, protected: true, unique: true},
        isActive: {type: 'boolean', defaultsTo: true},
        isAdmin: {type: 'boolean', defaultsTo: false},
        email: {type: 'email', size: 180, minLength: 4, unique: true, required: true},
        hitCount:{type: 'integer', defaultsTo: 0,required: true},
        profiles:{
            collection: 'ChatonUserProfile',
            via: 'user'
        }
    },
    beforeCreate: function (values, cb) {

        values.sessionkey = cryptoJS.SHA256(values.username + Math.ceil(Math.random() * 2 ^ 32 + Math.random() * 2 ^ 13)).toString(cryptoJS.enc.Base64);

        cb();

    },
    beforeUpdate: function (values, cb) {

        values.sessionkey = cryptoJS.SHA256(values.username + Math.ceil(Math.random() * 2 ^ 32 + Math.random() * 2 ^ 13)).toString(cryptoJS.enc.Base64);

        cb();

    },
    beforeValidate: function (values, cb) {

        values.sessionkey = cryptoJS.SHA256(values.username + Math.ceil(Math.random() * 2 ^ 32 + Math.random() * 2 ^ 13)).toString(cryptoJS.enc.Base64);

        cb();

    }
};

