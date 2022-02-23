const getLastUpdateString = () => {
  const date = new Date();
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
      console.err('addCache: Failed to execute passed function');
    }
  }

  return cache;
};

module.exports = { getLastUpdateString, addCache };
