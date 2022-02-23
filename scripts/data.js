const tinkoff_v2 = require('./tinkoff_v2.js');
const utils = require('./utils.js');

const TOKEN = process.env.TINKOFF_INVEST_TOKEN;
const ACCOUNT_ID = process.env.TINKOFF_INVEST_ACCOUNT_ID;

const api = new tinkoff_v2({
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
    console.error(err);
  }

  ticker = shareData.instrument.ticker;

  return ticker;
};

const parseData = async () => {
    const data = {};
    try {
      const portfolio = await api.Operations.GetPortfolio({
        account_id: ACCOUNT_ID,
      });
  
      for (const position of portfolio.positions) {
        const ticker = await processPosition(position);
        data[ticker] = position;
      }
    } catch (err) {
      console.error('Parse Data Failed');
      throw err;
    }

    data.options = {
      last_update: utils.getLastUpdateString(),
    };
  
    return data;
};


const getData = async () => {
  return utils.addCache(parseData, 5000)
    .catch((err) => {
      console.error(err);

      return err;
    });
};

module.exports = { getData };
