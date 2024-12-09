import { handleResponse, handleError } from "./apiUtils";

export function getPortfolioHoldings(portfolio_id) {
  const baseUrl = process.env.API_URL + `/api/holdings/${portfolio_id}`;

  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export function deletePortfolioHolding({ symbol, port_id, user_id }) {
  return fetch(
    process.env.API_URL + `/api/holdings/${port_id}/${symbol}/${user_id}`,
    {
      method: "DELETE",
    }
  )
    .then(handleResponse)
    .catch(handleError);
}
