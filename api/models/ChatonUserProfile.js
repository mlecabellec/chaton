/**
 * ChatonUserProfile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        id:{type:"integer",unique:true,primaryKey:true},
        displayName: {type: 'string', size: 64, minLength: 4,required:true},
        user: {model: "ChatonUser",protected:true},
        messages: {
            collection: 'ChatonMessage',
            via: 'userProfile'
        }
    }
};

