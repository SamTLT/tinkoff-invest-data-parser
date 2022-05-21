const axios = require('axios').default;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const TINKOFF_FUNDS_URL = 'https://www.tinkoffcapital.ru/statistics/';

const tableHeaders = {};
const tableRows = {};

const getTinkoffFunds = async (name, column) =>
  axios
    .get(TINKOFF_FUNDS_URL)
    .then(async (response) => {
      const dom = new JSDOM(response.data);
      dom.window.document
        .querySelector('table')
        .querySelector('thead')
        .querySelectorAll('th')
        .forEach((th, i) => {
          tableHeaders[th.textContent] = i;
        });

      const rows = dom.window.document
        .querySelector('table')
        .querySelector('tbody')
        .querySelectorAll('tr');

      rows.forEach((tr, i) => {
        const fundName = tr.querySelector('td').textContent;
        tableRows[fundName] = i;
      });

      const nameId = tableRows[name];
      const columnId = tableHeaders[column];

      const result = parseFloat(
        rows[nameId]
          .querySelectorAll('td')
          [columnId].querySelector('div')
          .textContent.replace(/\s/g, '')
          .replace(/,/g, '.')
      );

      return result;
    })
    .catch(function (error) {
      console.log(error);
      return 'error';
    });

// getTinkoffFunds('Тинькофф S&P 500', 'Пай за последний день');
// getTinkoffFunds('Тинькофф iMOEX', 'СЧА за последний день');

module.exports = { getTinkoffFunds };
