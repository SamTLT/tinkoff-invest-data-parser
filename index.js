require('dotenv').config();
const tinkoff_v2 = require('./tinkoff_v2.js');
const jsftp = require("jsftp");

const TOKEN = process.env.TINKOFF_INVEST_TOKEN;
const ACCOUNT_ID = process.env.TINKOFF_INVEST_ACCOUNT_ID;

const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_HOST = '217.174.105.4';
const FTP_PORT = 21;
const FTP_OUTPUT_FILE_PATH = 'www/khovalkin.com/1/stocks';

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

  return data;
}

const uploadData = (data) => {
  const ftp = new jsftp({
    host: FTP_HOST,
    port: FTP_PORT, // defaults to 21
    user: FTP_USER, // defaults to "anonymous"
    pass: FTP_PASSWORD // defaults to "@anonymous"
  });

  ftp.put(Buffer.from(JSON.stringify(data)), FTP_OUTPUT_FILE_PATH, err => {
    if (!err) {
      console.log("File Transferred Successfully!");
      process.exit();
    } else {
      console.error('FTP Data Sending Failed');
      throw err;
    }
  });
}


parseData().then(data => {
  uploadData(data);
}).catch(err => {
  console.error(err);
});
