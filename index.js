module.exports = (axios) => {
  axios.defaults.retry = 4;
  axios.defaults.retryDelay = 1000;
  axios.defaults.timeout = 5000;
  axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    let config = err.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);
  
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
  
    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(err);
    }
  
    // Increase the retry count
    config.__retryCount += 1;
  
    // Create new promise to handle exponential backoff
    const backoff = new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
  
    // Return the promise in which recalls axios to retry the request
    return backoff.then(() => {
      console.log(`retry #${config.__retryCount}: ${config.url}`, )
      return axios(config);
    });
  });
}