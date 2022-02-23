const getLastUpdateTimestamp = () => new Date().getTime();

const awaitTimeout = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('done!');
    }, ms);
  });

module.exports = { getLastUpdateTimestamp, awaitTimeout };
