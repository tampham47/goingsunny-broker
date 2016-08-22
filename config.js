/**
 * Goingsunny 2016
 * Tw
 */

var mosca = require('mosca');

module.exports = {
  id: 'mymosca', // used to publish in the $SYS/<id> topicspace
  stats: false, // publish stats in the $SYS/<id> topicspace
  port: 5550,
  http: {
    port: 5551,
    static: __dirname + "/public",
    bundle: true
  },
  logger: {
    level: 'debug'
  },
  backend: {
    type: 'mongodb',
    url: "mongodb://localhost:27017/goingsunny-broker"
  },
  persistence: {
    factory: mosca.persistence.Mongo,
    url: "mongodb://localhost:27017/goingsunny-broker"
  }
};
