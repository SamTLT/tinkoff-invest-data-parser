const STOCKS_JSON = 'https://khovalkin.com/1/stocks';

function httpGet(url) {
  const response = UrlFetchApp.fetch(url);
  return response.getContentText();
}

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
  return JSON.options.last_update;
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
