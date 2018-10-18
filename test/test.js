const axios = require('axios');
const art = require('../index');
art(axios);

(async () => {
  try {
    await axios({
      url: 'https://google.com',
      method: 'get',
      timeout: 2000,
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