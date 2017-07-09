'use strict';

/*
 * 发布的文章, 博主, follow 记录, like 记录
 */
let modelFiles = ['post', 'blog', 'follow_relation', "like"];

let BigCamlize = (str) => {
  return str.replace(/(^[a-z]|\_[a-z])/g, (matched) => {
    return matched.replace('_', '').toUpperCase();
  });
}

module.exports = (toshihikoCon) => {
  let exp = {};
  modelFiles.forEach((name) => {
    let schemaDefine = require(__dirname + `/${name}`);
    if(!(schemaDefine instanceof Function)) return;
    let modelName = BigCamlize(name);
    // console.log('in model/index.js', modelName, name);
    exp[modelName] = schemaDefine(toshihikoCon)
  });
  return exp
}
