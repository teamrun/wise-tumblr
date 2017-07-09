'use strict';
const path = require('path');
let ty = require('toshihiko').Type;

let nullableFields = [
];

let fields = [
  {name: 'id', primaryKey: true, type: ty.Integer},
  {name: 'master', type: ty.String},
  {name: 'target', type: ty.String},
  {name: 'updated', type: ty.Integer}
];
fields.forEach((f) => {
  if(nullableFields.indexOf(f.name) >= 0 ){
    f.allowNull = true;
  }
});

module.exports = (toshiCon) => {
  return toshiCon.define(path.basename(__filename, '.js'), fields);
}
