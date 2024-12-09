import { handleResponse, handleError } from "./apiUtils";

export function loadBuyTransactions(user_id) {
  const baseUrl = process.env.API_URL + `/api/transactions/${user_id}`;
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export function updateBuyTransaction(updatedTransaction) {
  const { newTransaction, trans_buy_id } = updatedTransaction;

  let baseUrl = process.env.API_URL + `/api/transactions/`;

  if (!newTransaction) {
    baseUrl += `${trans_buy_id}`;
  }
  console.log("updatedTransaction api: ", updatedTransaction);
  return fetch(baseUrl, {
    method: newTransaction ? "POST" : "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(updatedTransaction),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteBuyTransaction(transId) {
  return fetch(process.env.API_URL + `/api/transactions/${transId}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteHoldingTransactions(deleteHolding) {
  const { port_id, symbol } = deleteHolding;

  return fetch(process.env.API_URL + `/api/transactions/${port_id}/${symbol}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .catch(handleError);
}

// old versions
export function loadTransactions(trans) {
  const { port_id, symbol } = trans;
  const baseUrl =
    process.env.API_URL + `/api/transactions/${port_id}/${symbol}`;
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export function updateTransaction(updatedTransaction) {
  console.log(
    "API: updatedTransaction",
    updatedTransaction,
    "JSON.stringify(updatedTransaction)",
    JSON.stringify(updatedTransaction)
  );

  let baseUrl = process.env.API_URL + `/api/transactions/`;

  // const transId = updatedTransaction.trans_buy_id;
  const newTransaction = updatedTransaction.newTransaction;

  if (!newTransaction) {
    baseUrl += `${updatedTransaction.trans_buy_id}`;
  }

  // if (transId) {
  //   baseUrl += `${transId}`;
  // }

  return fetch(baseUrl, {
    method: newTransaction ? "POST" : "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(updatedTransaction),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteTransaction({
  deleteTransactionId,
  deletedTransSymbol,
  deletedTransPortId,
}) {
  console.log(
    "deleteTransaction: deletedTransSymbol: ",
    deletedTransSymbol,
    "deletedTransPortId",
    deletedTransPortId
  );

  const transId = deleteTransactionId;
  const symbol = deletedTransSymbol;
  const portId = deletedTransPortId;
  return fetch(
    process.env.API_URL + `/api/transactions/${portId}/${symbol}/${transId}`,
    { method: "DELETE" }
  )
    .then(handleResponse)
    .catch(handleError);
}
