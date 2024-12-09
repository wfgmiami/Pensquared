import {
  LOAD_PORTFOLIOS_SUCCESS,
  LOAD_PORTFOLIO_HOLDINGS_SUCCESS,
  LOAD_BUY_TRANSACTIONS_SUCCESS,
} from "./actionTypes";
import { initialLoad as initialLoadApi } from "../../api/initialLoadApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function initialLoad(user_id) {
  return (dispatch) => {
    dispatch(beginApiCall());
    return initialLoadApi(user_id)
      .then((data) => {
        console.log("data: ", data);
        dispatch(loadPortfoliosSuccess(data));
        dispatch(loadPortfolioHoldingsSuccess(data));
        dispatch(loadBuyTransactionsSuccess(data));
      })
      .catch((error) => {
        dispatch(apiCallError(error));
        // dispatch(loadPortfoliosFailure(error));
      });
  };
}

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

function loadPortfolioHoldingsSuccess(data) {
  const holdings = data.holdings;
  return {
    type: LOAD_PORTFOLIO_HOLDINGS_SUCCESS,
    holdings,
  };
}

function loadBuyTransactionsSuccess({ buyTransactions }) {
  return {
    type: LOAD_BUY_TRANSACTIONS_SUCCESS,
    buyTransactions,
  };
}
