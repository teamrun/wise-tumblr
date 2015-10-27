var _ = require("lodash");
var mongoose = require('mongoose');
var debug = require("debug")('db');
var requireDir = require('require-dir');

var dbUri;
var dbConf = config.mongoose;
if(dbConf.user && dbConf.pass){
  dbUri = `mongodb://${dbConf.user}:${dbConf.pass}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
}
else{
  dbUri = `mongodb://${dbConf.host}:${dbConf.port}/${dbConf.database}`
}

mongoose.connect(dbUri);

var model = {};

var modelSchemas = requireDir('./model');

for(var i in modelSchemas){
  var modelName = _.capitalize(i);
  var setting = modelSchemas[i];
  if(setting && setting.schema){
    var schema = new mongoose.Schema(setting.schema);
    schema.index(setting.indexes);
    model[modelName] = mongoose.model(modelName, schema);
  }
}

debug(`model define done! ${Object.keys(model)}`);


module.exports = model;
