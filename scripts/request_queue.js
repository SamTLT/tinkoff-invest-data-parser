const { awaitTimeout } = require('./utils.js');

class RequestQueue {
  cacheData;
  isCacheFresh = false;
  isLoading = false;

  queue = [];

  constructor(timeout) {
    this.timeout = timeout;
  }

  addRequest = async (fn) => {
    this.queue.unshift(fn);
    return await this.processQueue();
  };

  processQueue = async () => {
    if (!this.isCacheFresh) {
      if (!this.isLoading) {
        try {
          this.isLoading = true;
          const fn = this.queue.pop();
          const data = await fn();

          this.cacheData = data;

          this.isCacheFresh = true;
          this.isLoading = false;
          setTimeout(() => (this.isCacheFresh = false), this.timeout);

          return data;
        } catch (err) {
          this.isCacheFresh = false;
          this.isLoading = false;

          console.error('addCache: Failed to execute passed function');
          console.error(err);

          if (this.cacheData) {
            return this.cacheData;
          }

          throw new Error('addCache: No cache to return');
        }
      } else {
        await awaitTimeout(this.timeout);

        if (!this.isLoading) {
          return await this.processQueue();
        }

        if (!this.cacheData) {
          throw new Error('addCache: No cache to return');
        }
      }
    }

    return this.cacheData;
  };
}

module.exports = { RequestQueue };
