barnacles-webhook
=================

Webhook interface for [barnacles](https://github.com/reelyactive/barnacles/) and/or [chimps](https://github.com/reelyactive/chimps/) open source software packages.  A webhook provides event notifications via HTTP POST.

__barnacles-webhook__ POSTs the following events as JSON:
- raddec (RADio DECoding data)
- dynamb (DYNamic AMBient data)
- spatem (SPAtial-TEMporal data)


Installation
------------

    npm install barnacles-webhook


Hello barnacles-webhook
-----------------------

The following code will POST _simulated_ [raddec](https://github.com/reelyactive/raddec/) data to the /raddecs route on a local server running on port 80.  The simulated data is provided by [barnowl](https://github.com/reelyactive/barnowl/) which is typically run in conjunction with [barnacles](https://github.com/reelyactive/barnacles/).  Install the _barnowl_, _barnacles_ and _barnacles-webhook_ packages using npm before running the code.

```javascript
const Barnowl = require('barnowl');
const Barnacles = require('barnacles');
const BarnaclesWebhook = require('barnacles-webhook');

let barnowl = new Barnowl();
barnowl.addListener(Barnowl, {}, Barnowl.TestListener, {});

let barnacles = new Barnacles({ barnowl: barnowl });
barnacles.addInterface(BarnaclesWebhook, { /* See options below */ });
```


Options
-------

__barnacles-webhook__ supports the following options:

| Property      | Default     | Description                                    | 
|:--------------|:------------|:-----------------------------------------------|
| useHttps      | false       | POST via HTTPS (true) or HTTP (false)          |
| hostname      | "localhost" | Hostname of the target server                  |
| port          | 80          | Port of the target server                      |
| raddecPath    | "/raddecs"  | Path for raddec objects on the target server   |
| dynambPath    | "/dynambs"  | Path for dynamb objects on the target server   |
| spatemPath    | "/spatems"  | Path for spatem objects on the target server   |
| printErrors   | false       | Print errors to the console (for debug)        |
| customHeaders | {}          | Dictionary of additional key/values for the header |

By default __barnacles-webhook__ will POST to http://localhost/raddecs.


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

[![Known Vulnerabilities](https://snyk.io/test/github/reelyactive/barnacles-webhook/badge.svg)](https://snyk.io/test/github/reelyactive/barnacles-webhook)


License
-------

MIT License

Copyright (c) 2019-2022 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
