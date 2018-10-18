module.exports = (axios) => {
  axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    let config = err.config;

    // If config does not exist or the retry option is not set, reject
    if (!config) return Promise.reject(err);

    // set default retry times
    if (!config.retry) config.retry = 3;

    // check retryCode
    if (config.retryCode && config.retryCode.length > 0 && !config.retryCode.includes(err.code)) {
      console.log('不需要重试');
      return Promise.reject(err);
    }
  
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
  
    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) return Promise.reject(err);
  
    // Increase the retry count
    config.__retryCount += 1;
  
    // Create new promise to handle exponential backoff
    const backoff = new Promise(resolve => setTimeout(resolve, config.retryDelay || 50));
  
    // Return the promise in which recalls axios to retry the request
    return backoff.then(() => {
      // run retryBeforeFn before request
      if (config.retryBeforeFn) config.retryBeforeFn(config);
      return axios(config);
    });
  });
}