'use strict';
const path = require('path');
let ty = require('toshihiko').Type;

let nullableFields = [
  'title',
  'description'
];

let fields = [
  {name: 'id', primaryKey: true, type: ty.Integer, autoIncrement: true},
  {name: 'name', type: ty.String},
  {name: 'url', type: ty.String},
  {name: 'avatar', type: ty.String},
  {name: 'title', type: ty.String},
  {name: 'description', type: ty.String}
];
fields.forEach((f) => {
  if(nullableFields.indexOf(f.name) >= 0 ){
    f.allowNull = true;
  }
});

module.exports = (toshiCon) => {
  return toshiCon.define(path.basename(__filename, '.js'), fields);
}
