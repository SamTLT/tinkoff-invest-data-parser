const getLastUpdateString = () => {
  const date = new Date();
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU')}`;
};

let cache;
let isCached = false;

const addCache = async (fn, ms) => {
  if (!isCached) {
    try {
      const data = await fn();

      isCached = true;
      cache = data;
      setTimeout(() => (isCached = false), ms);

      return data;
    } catch (err) {
      console.error('addCache: Failed to execute passed function');
      console.error(err);
      isCached = false;

      throw new Error('addCache: Failed to execute passed function');
    }
  }

  return cache;
};

module.exports = { getLastUpdateString, addCache };
