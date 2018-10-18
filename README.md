# axios-retry-tiny

a tiny interceptor for axios to retry request

## Install

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
      retryBeforeFn: (config) => {
        console.log(`retry #${config.__retryCount}: ${config.url}`);
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

| code           | type   | desc         |
|----------------|--------|--------------|
| 'ECONNABORTED' | string | timeout      |
| 'ETIMEDOUT'    | string | timeout      |
| 4**            | number | client error |
| 5**            | number | server error |

## Thinks
Happy to thinks
- [axios issus #164](https://github.com/axios/axios/issues/164#issuecomment-327837467)
- [JustinBeckwith/retry-axios](https://github.com/JustinBeckwith/retry-axios)