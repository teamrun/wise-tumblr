'use strict';

const path = require('path');
const _ = require('lodash');

const clientCreator = require('../util/clientCreator');

let clients = {};
let names = [];
const base_conf = {
  consumer_key: 'LSOJqOOqefr0zc3nFoTyeIwqs7JeeoHRBE0E6A4N573zwX9V2W',
  consumer_secret: 'ATdwEZ8DlfprOiUGqReAoHJZAjs5lEHOuDZ8khAvhZzEdYujKM',
};

let clientConf = [];
try{
  clientConf = require('../client_conf.json');
}
catch(e){}

for(var i in clientConf){
  var item = clientConf[i];
  var name = item.name;
  names.push(name);

  clients[name] = clientCreator(_.assign({}, item, base_conf));
}

let randomClient = () => {
  return clients[_.sample(names)];
};

Object.defineProperty(clients, 'random', {
  get: randomClient
});


module.exports = clients
