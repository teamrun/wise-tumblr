import _ from 'lodash';

import clientCreator from '../util/clientCreator';

let clients = {};
let names = [];
let confs = [
  {
    name: 'libertyartchen',
    consumer_key: 'LSOJqOOqefr0zc3nFoTyeIwqs7JeeoHRBE0E6A4N573zwX9V2W',
    consumer_secret: 'ATdwEZ8DlfprOiUGqReAoHJZAjs5lEHOuDZ8khAvhZzEdYujKM',
    token: 'LWyVXvxt4AAVT0lMT370pwBRFhoxKna8ibAH2SzSwaqxTNJV9U',
    token_secret: 'LDgi43Yfd53EezKZyhlU74TkeQRtd5xMmZLTtfBzpEOOnq2y2e'
  }
];

for(var i in confs){
  var item = confs[i];
  var name = item.name;
  names.push(name);

  clients[name] = clientCreator(item);
}

let randomClient = () => {
  return clients[_.sample(names)]
};

export default {
  blogInfo: (blogName) => {
    return randomClient().blogInfo(blogName)
      .then((data) => {
        return data.blog
      });
  },
  avatar: (param) => {
    return randomClient().avatar(param.name, param.size)
      .then((data) => {
        console.log(data);
        return data.avatar_url;
      })
  }
}
