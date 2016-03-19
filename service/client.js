import path from 'path';
import _ from 'lodash';

import clientCreator from '../util/clientCreator';

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

let confs = clientConf;

for(var i in confs){
  var item = confs[i];
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


export default clients
