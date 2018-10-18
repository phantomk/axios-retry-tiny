const axios = require('axios');
const art = require('../index');
art(axios);
(async () => {
  try {
    await axios({
      url: 'https://google.com',
      method: 'get'
    });
  } catch (error) {
    console.log(error);
  }
})();