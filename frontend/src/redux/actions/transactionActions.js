import {
  LOAD_BUY_TRANSACTIONS_SUCCESS,
  LOAD_BUY_TRANSACTIONS_FAILURE,
  REMOVE_BUY_TRANSACTIONS_SUCCESS,
  UPDATE_BUY_TRANSACTION_SUCCESS,
  UPDATE_BUY_TRANSACTION_FAILURE,
  ADD_BUY_TRANSACTION_SUCCESS,
  DELETE_BUY_TRANSACTIONS_SUCCESS,
  DELETE_BUY_TRANSACTIONS_FAILURE,
  DELETE_HOLDING_TRANSACTIONS_SUCCESS,
  DELETE_HOLDING_TRANSACTIONS_FAILURE,
  LOAD_PORTFOLIOS_SUCCESS,
  LOAD_PORTFOLIO_HOLDINGS_SUCCESS,
  UPDATE_PORTFOLIO_SUCCESS,
} from "./actionTypes";
import {
  loadBuyTransactions as loadBuyTransactionsApi,
  updateBuyTransaction as updateBuyTransactionApi,
  deleteBuyTransaction as deleteBuyTransactionApi,
  deleteHoldingTransactions as deleteHoldingTransactionsApi,
} from "../../api/transactionApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadBuyTransactions(user_id) {
  return (dispatch) => {
    dispatch(beginApiCall());
    return loadBuyTransactionsApi(user_id)
      .then((data) => {
        console.log("data: ", data);
        dispatch(loadBuyTransactionsSuccess(data));
      })
      .catch((error) => {
        dispatch(apiCallError(error));
        dispatch(loadBuyTransactionsFailure(error));
      });
  };
}

export function updateBuyTransaction(row) {
  const { newTransaction } = row;

  return (dispatch) => {
    dispatch(beginApiCall());
    return updateBuyTransactionApi(row)
      .then((data) => {
        if (newTransaction) {
          // dispatch(loadPortfoliosSuccess(data));
          // dispatch(loadPortfolioHoldingsSuccess(data));

          dispatch(addBuyTransactionSuccess(data));
        } else {
          dispatch(updatePortfolioSuccess(data));
          dispatch(updateBuyTransactionSuccess(data));
        }
        // newTransaction
        //   ? dispatch(addBuyTransactionSuccess(data))
        //   : dispatch(updateBuyTransactionSuccess(data));
      })
      .catch((error) => {
        dispatch(apiCallError(error));
        dispatch(updateBuyTransactionFailure(error));
      });
  };
}

export function removeBuyTransactions() {
  return (dispatch) => {
    dispatch(removeBuyTransactionsSuccess());
  };
}

export function deleteBuyTransaction(deleteTransaction) {
  const { trans_buy_id } = deleteTransaction;
  return (dispatch) => {
    return deleteBuyTransactionApi(trans_buy_id)
      .then(() => {
        dispatch(deleteBuyTransactionSuccess(trans_buy_id));
      })
      .catch((error) => {
        console.log("error: ", error);
        dispatch(deleteBuyTransactionFailure(error));
      });
  };
}

export function deleteHoldingTransactions(deleteHolding) {
  return (dispatch) => {
    return deleteHoldingTransactionsApi(deleteHolding)
      .then(() => {
        dispatch(deleteHoldingTransactionsSuccess(deleteHolding));
      })
      .catch((error) => {
        console.log("error: ", error);
        dispatch(deleteHoldingTransactionsFailure(error));
      });
  };
}

function loadBuyTransactionsSuccess({ buyTransactions }) {
  console.log("buyTransactions: ", buyTransactions);
  return {
    type: LOAD_BUY_TRANSACTIONS_SUCCESS,
    buyTransactions,
  };
}

function loadBuyTransactionsFailure(error) {
  return {
    type: LOAD_BUY_TRANSACTIONS_FAILURE,
    error,
  };
}

function removeBuyTransactionsSuccess() {
  return {
    type: REMOVE_BUY_TRANSACTIONS_SUCCESS,
  };
}

function addBuyTransactionSuccess({ buyTransaction }) {
  console.log("buyTransaction: ", buyTransaction);
  return {
    type: ADD_BUY_TRANSACTION_SUCCESS,
    buyTransaction,
  };
}

function updateBuyTransactionSuccess({ buyTransaction }) {
  const updatedTransaction = buyTransaction[0];

  return {
    type: UPDATE_BUY_TRANSACTION_SUCCESS,
    updatedTransaction,
  };
}

function updateBuyTransactionFailure(error) {
  return {
    type: UPDATE_BUY_TRANSACTION_FAILURE,
    error,
  };
}

function deleteBuyTransactionSuccess(trans_buy_id) {
  return {
    type: DELETE_BUY_TRANSACTIONS_SUCCESS,
    trans_buy_id,
  };
}

function deleteBuyTransactionFailure(error) {
  return {
    type: DELETE_BUY_TRANSACTIONS_FAILURE,
    error,
  };
}

function deleteHoldingTransactionsSuccess(deleteHolding) {
  return {
    type: DELETE_HOLDING_TRANSACTIONS_SUCCESS,
    deleteHolding,
  };
}

function deleteHoldingTransactionsFailure(error) {
  return {
    type: DELETE_HOLDING_TRANSACTIONS_FAILURE,
    error,
  };
}

// DERIVED ACTIONS
function loadPortfoliosSuccess(data) {
  const portfolios = data.portfolios;
  // console.log(
  //   "loadPortfolioSuccess: portfoliosData: ",
  //   portfoliosData
  // );
  return {
    type: LOAD_PORTFOLIOS_SUCCESS,
    payload: { portfolios, porfoliosLoadedStatus: "success" },
  };
}

function updatePortfolioSuccess(data) {
  const portfolio = data.portfolio;
  return {
    type: UPDATE_PORTFOLIO_SUCCESS,
    portfolio,
  };
}

function loadPortfolioHoldingsSuccess(data) {
  const holdings = data.holdings;
  return {
    type: LOAD_PORTFOLIO_HOLDINGS_SUCCESS,
    holdings,
  };
}
