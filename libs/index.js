/**
 * tw
 */

import mosca from 'mosca';
import superAgent from 'superagent';
import configMosca from 'config/config-mosca';
import { CronJob } from 'cron';

import joinSection from './join-section';
import metting from './metting';
import subscribe from './subscribe';
import feedback from './feedback';
import remind from './remind';

var server = new mosca.Server(configMosca);

// matching
var job01 = new CronJob({
  cronTime: '*/30 * * * * *', // every 30 sec
  onTick: function() {
    metting(server);
  },
  timeZone: 'Asia/Ho_Chi_Minh',
  start: false,
});

// send notification for users who has subscribe this morning
var job02 = new CronJob({
  cronTime: '00 50 19 * * *', // 19h50 everyday
  onTick: function () {
    subscribe();
  },
  timeZone: 'Asia/Ho_Chi_Minh',
  start: false,
});

var job03 = new CronJob({
  cronTime: '00 00 20 * * *', // 20h00 everyday
  onTick: function () {
    subscribe(true);
  },
  timeZone: 'Asia/Ho_Chi_Minh',
  start: false,
});

// ask for feedbacks
var job04 = new CronJob({
  cronTime: '00 20 22 * * *', // 22h00 everyday
  onTick: function () {
    feedback(server);
  },
  timeZone: 'Asia/Ho_Chi_Minh',
  start: false,
});

// Thurday remind
var job05 = new CronJob({
  cronTime: '00 30 08 * * THU', // THU 08 30
  onTick: function () {
    remind(server);
  },
  timeZone: 'Asia/Ho_Chi_Minh',
  start: false,
});

// init cron jobs
console.log('STARTED!');
job01.start();
job02.start();
job03.start();
job04.start();
// job05.start();


// start broker
server.on('error', function(err){});
server.on('clientConnected', function(client) {});
server.on('ready', function(){
  console.log('Mosca server is up and running on port: ' + configMosca.port);
})
// fired when a message is received
server.on('published', function(packet, client) {
  switch (packet.topic) {
    case 'join-class':
      joinSection(packet, client, server);
      break;
    default: 
      break;
  }
});
