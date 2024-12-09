import { handleResponse, handleError } from "./apiUtils";

const baseUrl = process.env.API_URL + "/api/marketdata";

export function getQuotes(symbols) {
  console.log("symbols: ", symbols);

  return fetch(baseUrl + `/quotes`, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(symbols),
  })
    .then(handleResponse)
    .catch(handleError);
}

// updating the price for already existing holdings (HoldingTable)
export function updatePrices(prices) {
  return fetch(baseUrl + "/prices", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(prices),
  })
    .then(handleResponse)
    .catch(handleError);
}

// add a new symbol and its price to the currentprice table (AddSymbol)
export function addSymbolPriceTable(addSymbolPriceTable) {
  return fetch(baseUrl + "/symbol", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(addSymbolPriceTable),
  })
    .then(handleResponse)
    .catch(handleError);
}
