const TinkoffV2 = require('./tinkoff_v2');
const { getLastUpdateTimestamp } = require('./utils');
const requestQueue = require('./request_queue');

const TOKEN = process.env.TINKOFF_INVEST_TOKEN;
const ACCOUNT_ID = process.env.TINKOFF_INVEST_ACCOUNT_ID;

const api = new TinkoffV2({
  isDebug: false,
  token: TOKEN,
});

const processPosition = async (position) => {
  const params = {
    id_type: 1,
    id: position.figi,
  };

  let shareData;

  try {
    if (position.instrument_type === 'share') {
      shareData = await api.Instruments.ShareBy(params);
    }
    if (position.instrument_type === 'etf') {
      shareData = await api.Instruments.EtfBy(params);
    }
    if (position.instrument_type === 'currency') {
      shareData = await api.Instruments.CurrencyBy(params);
    }
  } catch (err) {
    console.error('processPosition: process failed');
    console.error(err);
  }

  return shareData?.instrument?.ticker;
};

const parseData = async () => {
  const data = {};
  try {
    const portfolio = await api.Operations.GetPortfolio({
      account_id: ACCOUNT_ID,
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const position of portfolio.positions) {
      // eslint-disable-next-line no-await-in-loop
      const ticker = await processPosition(position);
      if (!ticker) {
        throw new Error('Failed to get ticker name');
      }
      data[ticker] = position;
    }
  } catch (err) {
    console.error('Parse Data Failed');
    throw err;
  }

  data.options = {
    last_update_timestamp: getLastUpdateTimestamp(),
  };

  return data;
};

const queue = new requestQueue.RequestQueue(5000);
const getData = async () => queue.addRequest(parseData);

module.exports = { getData };
