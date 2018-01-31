var config = require('../knexfile');
var knex = require('knex')(config);
var knexnest = require('knexnest');
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-modelbase-plus'));
bookshelf.plugin('pagination');
var ModelBase = require('bookshelf-modelbase')(bookshelf);

bookshelf.plugin('virtuals');
bookshelf.plugin('visibility');
bookshelf.plugin(require('bookshelf-modelbase').pluggable);

//knex.migrate.latest();

module.exports = ModelBase;
