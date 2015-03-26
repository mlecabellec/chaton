/**
* ChatonMessage.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      id:{type:"integer",unique:true,primaryKey:true},
      content:{type:"text",size:4000},
      user:{model:"ChatonUser",protected:true},
      userProfile:{model:"ChatonUserProfile"},
      thread:{model:"ChatonThread"}
  }
};

