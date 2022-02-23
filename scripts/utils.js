const getLastUpdateTimestamp = () => new Date().getTime();

const awaitTimeout = (ms) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve('done!');
    }, ms);
  });
};

module.exports = { getLastUpdateTimestamp, awaitTimeout };
