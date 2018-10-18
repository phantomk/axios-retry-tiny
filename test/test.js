const axios = require('axios');
const nock = require('nock');
const assert = require('assert');
const art = require('../index');
art(axios);

const url = 'http://www.example.com';

nock.disableNetConnect();

describe('axios-retry-tiny', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  let axiosConfig = {
    url: url,
    method: 'get',
    timeout: 2000,
    retry: 5,
    retryDelay: 100,
    retryCode: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH', 500, 404],
    retryBeforeFn: (e) => {
      console.log(`retry #${e.config.__retryCount}: ${e.config.url} : errCode: ${e.code || (e.response && e.response.status)}`);
    }
  }

  it('should retry 5 times with 404', async () => {
    const scope = nock(url).get('/').times(6).reply(404);
    try {
      axiosConfig.retryCode = [404];
      await axios(axiosConfig);
    } catch (e) {
      scope.done();
      const config = e.config;
      assert.equal(config.__retryCount, 5);
      assert.equal(config.retryDelay, 100);
      return;
    }
  });

  it('should retry 5 times with 500', async () => {
    const scope = nock(url).get('/').times(6).reply(500);
    try {
      axiosConfig.retryCode = [500];
      await axios(axiosConfig);
    } catch (e) {
      scope.done();
      const config = e.config;
      assert.equal(config.__retryCount, 5);
      assert.equal(config.retryDelay, 100);
      return;
    }
  });

  it('should retry 5 times with ECONNABORTED time out', async () => {
    const scope = nock(url).get('/').times(6).replyWithError({code: 'ECONNABORTED'});
    try {
      axiosConfig.retryCode = ['ECONNABORTED'];
      await axios(axiosConfig);
    } catch (e) {
      const config = e.config;
      scope.done();
      assert.equal(config.__retryCount, 5);
      assert.equal(config.retryDelay, 100);
      return;
    }
  });

  it('should retry 2 times with ETIMEDOUT', async () => {
    const scope = nock(url).get('/').times(3).replyWithError({code: 'ETIMEDOUT'});
    try {
      axiosConfig.retry = 2;
      axiosConfig.retryCode = ['ETIMEDOUT'];
      await axios(axiosConfig);
    } catch (e) {
      const config = e.config;
      scope.done();
      assert.equal(config.__retryCount, 2);
      assert.equal(config.retryDelay, 100);
      return;
    }
  });

  it('should retry 2 times with ENOTFOUND', async () => {
    const scope = nock(url).get('/').times(3).replyWithError({code: 'ENOTFOUND'});
    try {
      axiosConfig.retry = 2;
      axiosConfig.retryCode = ['ENOTFOUND'];
      await axios(axiosConfig);
    } catch (e) {
      const config = e.config;
      scope.done();
      assert.equal(config.__retryCount, 2);
      assert.equal(config.retryDelay, 100);
      return;
    }
  });

  it('should retry 2 times with ENETUNREACH', async () => {
    const scope = nock(url).get('/').times(3).replyWithError({code: 'ENETUNREACH'});
    try {
      axiosConfig.retry = 2;
      axiosConfig.retryCode = ['ENETUNREACH'];
      await axios(axiosConfig);
    } catch (e) {
      const config = e.config;
      scope.done();
      assert.equal(config.__retryCount, 2);
      assert.equal(config.retryDelay, 100);
      return;
    }
  });

  it('should retry 2 times with no retryCode Option', async () => {
    const scope = nock(url).get('/').times(3).replyWithError({code: 'ETIMEDOUT'});
    try {
      axiosConfig.retry = 2;
      axiosConfig.retryCode = undefined;
      await axios(axiosConfig);
    } catch (e) {
      const config = e.config;
      scope.done();
      assert.equal(config.__retryCount, 2);
      assert.equal(config.retryDelay, 100);
      return;
    }
  });
});