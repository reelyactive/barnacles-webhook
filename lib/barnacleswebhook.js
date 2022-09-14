/**
 * Copyright reelyActive 2019-2022
 * We believe in an open Internet of Things
 */


const http = require('http');
const https = require('https');


const DEFAULT_USE_HTTPS = false;
const DEFAULT_HOSTNAME = 'localhost';
const DEFAULT_PORT = 80;
const DEFAULT_RADDEC_PATH = '/raddecs';
const DEFAULT_DYNAMB_PATH = '/dynambs';
const DEFAULT_SPATEM_PATH = '/spatems';
const DEFAULT_PRINT_ERRORS = false;
const DEFAULT_CUSTOM_HEADERS = {};


/**
 * BarnaclesWebhook Class
 * Detects events and sends notifications.
 */
class BarnaclesWebhook {

  /**
   * BarnaclesWebhook constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.useHttps = options.useHttps || DEFAULT_USE_HTTPS;
    this.hostname = options.hostname || DEFAULT_HOSTNAME;
    this.port = options.port || DEFAULT_PORT;
    this.raddecPath = options.raddecPath || options.path || DEFAULT_RADDEC_PATH;
    this.dynambPath = options.dynambPath || DEFAULT_DYNAMB_PATH;
    this.spatemPath = options.spatemPath || DEFAULT_SPATEM_PATH;
    this.customHeaders = options.customHeaders || DEFAULT_CUSTOM_HEADERS;
    this.printErrors = options.printErrors || DEFAULT_PRINT_ERRORS;

    if(this.useHttps) {
      this.agent = new https.Agent({ keepAlive: true });
    }
    else {
      this.agent = new http.Agent({ keepAlive: true });
    }
  }

  /**
   * Handle an outbound raddec.
   * @param {Raddec} raddec The outbound raddec.
   */
  handleRaddec(raddec) {
    postEvent(this, raddec, this.raddecPath);
  }

  /**
   * Handle an outbound event.
   * @param {String} name The outbound event name.
   * @param {Object} data The outbound event data.
   */
  handleEvent(name, data) {
    let self = this;

    switch(name) {
      case 'raddec':
        return postEvent(self, data, self.raddecPath);
      case 'dynamb':
        return postEvent(self, data, self.dynambPath);
      case 'spatem':
        return postEvent(self, data, self.spatemPath);
    }
  }
}


/**
 * Post the given event data by forwarding via webhook via the given path.
 * @param {BarnaclesWebhook} instance The BarnaclesWebhook instance.
 * @param {Object} event The event data to POST.
 * @param {String} path The path via which to POST.
 */
function postEvent(instance, event, path) {
  let data = JSON.stringify(event);
  let headers = {
      "Content-Type": "application/json",
      "Content-Length": data.length
  };

  let options = {
      hostname: instance.hostname,
      port: instance.port,
      path: path,
      agent: instance.agent,
      method: 'POST',
      headers: Object.assign(headers, instance.customHeaders)
  };

  if(instance.useHttps) {
    postViaHttps(data, options, instance.printErrors);
  }
  else {
    postViaHttp(data, options, instance.printErrors);
  }
}


/**
 * POST the given data via HTTP.
 * @param {string} data The given data as a String.
 * @param {Object} options The request options.
 * @param {boolean} printErrors Should errors be printed to the console?
 */
function postViaHttp(data, options, printErrors) {
  let req = http.request(options, function(res) { });

  req.on('error', function(error) {
    if(printErrors) {
      let target = (error.address || options.hostname) + ':' +
                   (error.port || options.port);
      console.error('barnacles-webhook HTTP POST error code:', error.code,
                    'on', target);
    }
  });

  req.write(data);
  req.end();
}


/**
 * POST the given data via HTTPS.
 * @param {string} data The given data as a String.
 * @param {Object} options The request options.
 * @param {boolean} printErrors Should errors be printed to the console?
 */
function postViaHttps(data, options, printErrors) {
  let req = https.request(options, function(res) { });

  req.on('error', function(error) {
    if(printErrors) {
      let target = (error.address || options.hostname) + ':' +
                   (error.port || options.port);
      console.error('barnacles-webhook HTTPS POST error code:', error.code,
                    'on', target);
    }
  });

  req.write(data);
  req.end();
}


module.exports = BarnaclesWebhook;
