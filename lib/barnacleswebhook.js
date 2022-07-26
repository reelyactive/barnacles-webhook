/**
 * Copyright reelyActive 2019-2022
 * We believe in an open Internet of Things
 */


const http = require('http');
const https = require('https');


const DEFAULT_USE_HTTPS = false;
const DEFAULT_HOSTNAME = 'localhost';
const DEFAULT_PORT = 80;
const DEFAULT_PATH = '/raddecs';
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
    this.path = options.path || DEFAULT_PATH;
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
    handleRaddec(this, raddec);
  }

  /**
   * Handle an outbound event.
   * @param {String} name The outbound event name.
   * @param {Object} data The outbound event data.
   */
  handleEvent(name, data) {
    let self = this

    switch(name) {
      case 'raddec':
        return handleRaddec(self, data);
    }
  }
}


/**
 * Handle the given raddec by forwarding via webhook.
 * @param {BarnaclesWebhook} instance The BarnaclesWebhook instance.
 * @param {Raddec} raddec The raddec data.
 */
function handleRaddec(instance, raddec) {
  let data = JSON.stringify(raddec);
  
  const DEFAULT_HEADERS = {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
  }

  let options = {
      hostname: instance.hostname,
      port: instance.port,
      path: instance.path,
      agent: instance.agent,
      method: 'POST',
      headers:  Object.assign({},DEFAULT_HEADERS,instance.customHeaders)
      
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
