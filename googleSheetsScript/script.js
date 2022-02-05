const TSPX_URL = 'https://ru.investing.com/etfs/tspx';
const STOCKS_JSON = 'https://khovalkin.com/1/stocks';

function getTSPX() {
    const html = httpGet(TSPX_URL);
    const searchstring = 'class="newInput inputTextBox alertValue" placeholder="';

    const index = html.search(searchstring);
    if (index >= 0) {
      var startIndex = index + searchstring.length;
      var rate = html.substring(startIndex, startIndex + 6);
      Logger.log(rate);
      return rate;
    }

    return '0';
}

function httpGet(theUrl)
{
    var response = UrlFetchApp.fetch(theUrl);
    return response.getContentText();
}

function httpGetJSON(url)
{
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
      return JSON[ticker].average_position_price.toString().replace(/\./g,',');
    }

    return 0;
}

function getLastUpdateTime() {
    const JSON = httpGetJSON(STOCKS_JSON);
    return JSON.options.last_update;
}