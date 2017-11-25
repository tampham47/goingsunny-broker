/**
 * Author D.Xaolonist
 * 2016
 */

import request from 'request';
import _ from 'lodash';
import config from 'config/config';

export default function(opts) {
  const defaultOpts = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  defaultOpts.url = `${config.API_PATH}/${opts.functionName}`;
  delete opts.functionName;

  var options = _.defaults(opts, defaultOpts);

  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if (err) {
        return reject(err);
      }

      resolve(body);
    });
  });
}
