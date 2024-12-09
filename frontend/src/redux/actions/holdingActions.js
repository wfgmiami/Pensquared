import {
  LOAD_PORTFOLIO_HOLDINGS_SUCCESS,
  LOAD_PORTFOLIO_HOLDINGS_FAILURE,
  REMOVE_HOLDINGS_SUCCESS,
  ADD_PUBLIC_HOLDING_SUCCESS,
  REMOVE_PUBLIC_HOLDINGS_SUCCESS,
  REMOVE_ALL_PUBLIC_HOLDINGS_SUCCESS,
  DELETE_HOLDINGS_SUCCESS,
  DELETE_PORT_HOLDING_TRANS_SUCCESS,
} from "./actionTypes";
import {
  getPortfolioHoldings,
  deletePortfolioHolding as deletePortfolioHoldingApi,
} from "../../api/holdingApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadPortfolioHoldings(portfolio_id) {
  return (dispatch) => {
    dispatch(beginApiCall());
    return getPortfolioHoldings(portfolio_id)
      .then((data) => {
        // console.log("loadPortfolioHolding: data: ", data);
        dispatch(loadPortfolioHoldingsSuccess(data));
      })
      .catch((error) => {
        dispatch(apiCallError(error));
        dispatch(loadPortfolioHoldingsFailure(error));
      });
  };
}

export function removeHoldings() {
  return function (dispatch) {
    dispatch(removeHoldingsSuccess());
  };
}

// removes a holding/symbol in a portfolio(holdReducer) and all the transactions(transReducer)
export function deletePortfolioHolding(deleteHolding) {
  return (dispatch) => {
    return deletePortfolioHoldingApi(deleteHolding)
      .then(() => {
        dispatch(deletePortfolioHoldingSuccess(deleteHolding));
        dispatch(deletePortHoldingTransSuccess(deleteHolding));
      })
      .catch((error) => {
        console.log("error: ", error);
        // dispatch(deleteHoldingFailure(error));
      });
  };
}

function loadPortfolioHoldingsSuccess(data) {
  const holdings = data.holdings;
  return {
    type: LOAD_PORTFOLIO_HOLDINGS_SUCCESS,
    holdings,
  };
}

function loadPortfolioHoldingsFailure(error) {
  return {
    type: LOAD_PORTFOLIO_HOLDINGS_FAILURE,
    error,
  };
}

function removeHoldingsSuccess() {
  return {
    type: REMOVE_HOLDINGS_SUCCESS,
  };
}

function deletePortfolioHoldingSuccess(deleteHolding) {
  return {
    type: DELETE_HOLDINGS_SUCCESS,
    deleteHolding,
  };
}

function deletePortHoldingTransSuccess(deleteHolding) {
  return {
    type: DELETE_PORT_HOLDING_TRANS_SUCCESS,
    deleteHolding,
  };
}

// PUBLIC ACTIONS
export function createPublicHolding(holding) {
  return function (dispatch) {
    dispatch(createPublicHoldingSuccess(holding));
  };
}

export function removePublicHolding(deleteHolding) {
  return function (dispatch) {
    if (deleteHolding.symbol) {
      dispatch(removePublicHoldingSuccess(deleteHolding));
    } else {
      dispatch(removeAllPublicHoldingSuccess(deleteHolding));
    }
  };
}

function createPublicHoldingSuccess(holding) {
  return {
    type: ADD_PUBLIC_HOLDING_SUCCESS,
    payload: holding,
  };
}

function removePublicHoldingSuccess(deleteHolding) {
  return {
    type: REMOVE_PUBLIC_HOLDINGS_SUCCESS,
    deleteHolding,
  };
}

function removeAllPublicHoldingSuccess(deleteHolding) {
  return {
    type: REMOVE_ALL_PUBLIC_HOLDINGS_SUCCESS,
    deleteHolding,
  };
}
