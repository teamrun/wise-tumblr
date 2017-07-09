'use strict';
const path = require('path');
let ty = require('toshihiko').Type;

let nullableFields = [
  'recommended_source', 'recommended_color', 'title'
];

let fields = [
  {name: 'id', primaryKey: true, type: ty.Integer},
  {name: 'blog_name',           type: ty.String},
  {name: 'post_url',            type: ty.String},
  {name: 'slug',                type: ty.String},
  {name: 'type',                type: ty.String},
  {name: 'timestamp',           type: ty.Integer},
  {name: 'date',                type: ty.Datetime},
  {name: 'state',               type: ty.String},
  {name: 'format',              type: ty.String},
  {name: 'reblog_key',          type: ty.String},
  {name: 'tags',                type: ty.Json},
  {name: 'short_url',           type: ty.String},
  {name: 'summary',             type: ty.String},
  {name: 'recommended_source',  type: ty.String},
  {name: 'recommended_color',   type: ty.String},
  {name: 'highlighted',         type: ty.Json},
  {name: 'note_count',          type: ty.Integer},
  {name: 'title',               type: ty.String},
  {name: 'body',                type: ty.String},
  {name: 'photos',              type: ty.Json},
  {name: 'image_permalink',     type: ty.String},
  {name: 'caption',             type: ty.String},
  {name: 'reblog',              type: ty.Json},
  {name: 'trail',               type: ty.Json},
  {name: 'can_send_in_message', type: ty.Boolean},
  {name: 'can_reply',           type: ty.Boolean},
  {name: 'video_url',           type: ty.String},
  {name: 'html5_capable',       type: ty.Boolean},
  {name: 'thumbnail_url',       type: ty.String},
  {name: 'thumbnail_width',     type: ty.Integer},
  {name: 'thumbnail_height',    type: ty.Integer},
  {name: 'duration',            type: ty.Integer},
  {name: 'player',              type: ty.Json},
  {name: 'video_type',          type: ty.String}
];
fields.forEach((f) => {
  if(nullableFields.indexOf(f.name) >= 0 ){
    f.allowNull = true;
  }
});

module.exports = (toshiCon) => {
  return toshiCon.define(path.basename(__filename, '.js'), fields);
}
