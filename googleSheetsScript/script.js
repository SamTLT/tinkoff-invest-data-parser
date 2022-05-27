const STOCKS_JSON = 'https://service.endpoint/api';
const TINKOFF_FUNDS_SNP500_DATA = STOCKS_JSON + '/tinkoff-funds?name=%D0%A2%D0%B8%D0%BD%D1%8C%D0%BA%D0%BE%D1%84%D1%84%20S%26P%20500&column=%D0%9F%D0%B0%D0%B9%20%D0%B7%D0%B0%20%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C';

function httpGetJSON(url) {
  const response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText());
}

function getTickerQuantity(ticker) {
  if (ticker) {
    const JSON = httpGetJSON(STOCKS_JSON);

    if (!JSON[ticker]) {
      return 0;
    }
    return JSON[ticker].quantity;
  }

  return 0;
}

function getTickerAveragePrice(ticker) {
  if (ticker) {
    const JSON = httpGetJSON(STOCKS_JSON);

    if (!JSON[ticker]) {
      return 0;
    }
    return JSON[ticker].average_position_price.toString().replace(/\./g, ',');
  }

  return 0;
}

function getLastUpdateTime() {
  const JSON = httpGetJSON(STOCKS_JSON);

  const date = new Date(JSON.options.last_update_timestamp);
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString(
    'ru-RU'
  )}`;
}

function getTickerCurrentPrice(ticker) {
  if (ticker) {
    const JSON = httpGetJSON(STOCKS_JSON);

    if (!JSON[ticker]) {
      return 0;
    }
    return JSON[ticker].current_price.toString().replace(/\./g, ',');
  }

  return 0;
}

function getTickerExpectedYield(ticker) {
  if (ticker) {
    const JSON = httpGetJSON(STOCKS_JSON);

    if (!JSON[ticker]) {
      return 0;
    }
    return JSON[ticker].expected_yield.toString().replace(/\./g, ',');
  }

  return 0;
}

function getTinkoffSnP500Data() {
  const JSON = httpGetJSON(TINKOFF_FUNDS_SNP500_DATA);

  if (!JSON.message) {
    return 'error'; 
  }

  return JSON.message.toString().replace(/\./g, ',');
}
