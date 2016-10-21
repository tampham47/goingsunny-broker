/**
 * Goingsunny 2016
 * Tw
 */

var mosca = require('mosca');

var SECURE_KEY =  process.env.SECURE_KEY || '/etc/letsencrypt/live/goingsunny.com/privkey.pem';
var SECURE_CERT = process.env.SECURE_CERT || '/etc/letsencrypt/live/goingsunny.com/fullchain.pem';

module.exports = {
  id: 'mymosca', // used to publish in the $SYS/<id> topicspace
  stats: false, // publish stats in the $SYS/<id> topicspace
  port: 5550,
  secure : {
    keyPath: SECURE_KEY,
    certPath: SECURE_CERT,
  },
  http: {
    port: 5551,
    static: __dirname + '/public',
    bundle: true
  },
  logger: {
    level: 'debug'
  },
  backend: {
    type: 'mongodb',
    url: 'mongodb://localhost:27017/goingsunny-broker'
  },
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/goingsunny-broker'
  }
};
