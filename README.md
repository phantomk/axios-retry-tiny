# axios-retry-tiny

[![CircleCI](https://circleci.com/gh/phantomk/axios-retry-tiny/tree/master.svg?style=svg)](https://circleci.com/gh/phantomk/axios-retry-tiny/tree/master)
![npm-veriosn](https://img.shields.io/npm/v/axios-retry-tiny.svg)
![npm-dt](https://img.shields.io/npm/dt/axios-retry-tiny.svg)

A tiny interceptor for axios to retry request

## Install

```bash
npm i axios-retry-tiny --save
# or use yarn
yarn add axios-retry-tiny
```

## Use

```javascript
const axios = require('axios');
const artiny = require('axios-retry-tiny');
artiny(axios);

(async () => {
  try {
    await axios({
      url: 'https://google.com',
      method: 'get',
      retry: 5,
      retryDelay: 100,
      retryCode: ['ECONNABORTED', 'ETIMEDOUT', 500],
      retryBeforeFn: (e) => {
        console.log(`retry #${e.config.__retryCount}: ${e.config.url} : errCode: ${e.code || (e.response && e.response.status)}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
})();
```

## Option

| option        | type             | default        | desc                                            |
|---------------|------------------|----------------|-------------------------------------------------|
| retry         | number           | 3              | times to retry                                  |
| retryDelay    | number           | 50             | ms time to delay retry                          |
| retryCode     | [number, string] | all error code | the match axios error code to retry             |
| retryBeforeFn | function(config) |                | the function before retry, can get axios config |

### retryCode list

| code           | type   | desc             |
|----------------|--------|------------------|
| 'ECONNABORTED' | string | timeout          |
| 'ETIMEDOUT'    | string | timeout          |
| 'ENOTFOUND'    | string | server not found |
| 'ENETUNREACH'  | string | not reach        |
| 4**            | number | client error     |
| 5**            | number | server error     |

## Thinks
Happy to thinks
- [axios issus #164](https://github.com/axios/axios/issues/164#issuecomment-327837467)
- [JustinBeckwith/retry-axios](https://github.com/JustinBeckwith/retry-axios)

## License
[Apache-2.0](LICENSE)