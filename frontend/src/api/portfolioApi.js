import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/api/portfolios/";

export function loadPortfolios(user_id) {
  // console.log("portfoliApi: loadPortfolios: user_id: ", user_id);
  return fetch(baseUrl + user_id || "")
    .then(handleResponse)
    .catch(handleError);
}

export function loadPortfolio(portfolio_id) {
  // console.log(
  //   "frontend/src/api/portfoliApi: loadPortfolio: portfolio_id",
  //   portfolio_id
  // );
  return fetch(`${baseUrl}/${portfolio_id}`)
    .then(handleResponse)
    .catch(handleError);
}

export function createPortfolio(portfolio) {
  // console.log("portfoliApi: createPortfolio: portfolio: ", portfolio);

  return fetch(baseUrl + (portfolio.port_id || ""), {
    method: portfolio.port_id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
    headers: { "content-type": "application/json" },
    body: JSON.stringify(portfolio),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deletePortfolio(port_id) {
  // console.log(
  //   "deletePortfolio: port_id",
  //   port_id
  // );
  return fetch(baseUrl + port_id, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}

export function deletePortfolioOptimistic(portfolio_id) {
  return fetch(baseUrl + portfolio_id, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}

// PUBLIC
export function savePublicPortfolios(portfolios) {
  // console.log("portfoliApi: savePublicPortfolios: portfolios: ", portfolios);

  return fetch(baseUrl + "public", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(portfolios),
  })
    .then(handleResponse)
    .catch(handleError);
}
