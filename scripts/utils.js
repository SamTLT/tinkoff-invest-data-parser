const getLastUpdateString = () => {
  const date = new Date();
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString(
    'ru-RU'
  )}`;
};

const awaitTimeout = (ms) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('done!');
    }, ms);
  });
};

let cacheData;
let isCacheFresh = false;
let isLoading = false;

const addCache = async (fn, ms) => {
  if (!isCacheFresh) {
    if (!isLoading) {
      try {
        isLoading = true;
        const data = await fn();

        cacheData = data;
        isCacheFresh = true;
        setTimeout(() => (isCacheFresh = false), ms);
        isLoading = false;

        return data;
      } catch (err) {
        console.error('addCache: Failed to execute passed function');
        console.error(err);

        if (cacheData) {
          return cacheData;
        }

        throw new Error('addCache: No cache to return');
      }
    } else {
      await awaitTimeout(ms);

      if (!cacheData) {
        throw new Error('addCache: No cache to return');
      }
    }
  }

  return cacheData;
};

module.exports = { getLastUpdateString, addCache };
