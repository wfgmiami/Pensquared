import {
  LOAD_PORTFOLIOS_SUCCESS,
  LOAD_PORTFOLIOS_FAILURE,
  CREATE_PORTFOLIO_SUCCESS,
  UPDATE_PORTFOLIO_SUCCESS,
  DELETE_PORTFOLIO_SUCCESS,
  DELETE_PORTFOLIO_OPTIMISTIC,
  REMOVE_PORTFOLIOS_SUCCESS,
  ADD_PUBLIC_PORTFOLIO_SUCCESS,
  LOAD_PORTFOLIOS_LIST_SUCCESS,
  LOAD_PORTFOLIO_HOLDINGS_SUCCESS,
  LOAD_BUY_TRANSACTIONS_SUCCESS,
} from "./actionTypes";

import {
  loadPortfolios as loadPortfoliosApi,
  createPortfolio as createPortfolioApi,
  deletePortfolio as deletePortfolioApi,
  deletePortfolioOptimistic as deletePortfolioOptimisticApi,
  loadPortfolio as loadPortfolioApi,
  savePublicPortfolios as savePublicPortfoliosApi,
} from "../../api/portfolioApi";

export function loadPortfolios(user_id) {
  return function (dispatch) {
    return loadPortfoliosApi(user_id)
      .then((data) => {
        console.log("data: ", data);
        dispatch(loadPortfoliosSuccess(data));
        dispatch(loadPortfolioHoldingsSuccess(data));
        dispatch(loadBuyTransactionsSuccess(data));
      })
      .catch((error) => {
        dispatch(loadPortfoliosFailure(error));
      });
  };
}

// when there are changes to buyTransactions
export function loadPortfoliosList(portfolios) {
  return function (dispatch) {
    dispatch(loadPortfoliosListSuccess(portfolios));
  };
}

export function createPortfolio(portfolio) {
  const port_id = portfolio.port_id;

  return function (dispatch) {
    return createPortfolioApi(portfolio)
      .then((createdPortfolio) => {
        port_id
          ? dispatch(updatePortfolioSuccess(createdPortfolio))
          : dispatch(createPortfolioSuccess(createdPortfolio));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateReduxPortfolio(portfolio) {
  return function (dispatch) {
    dispatch(updatePortfolioSuccess({ portfolio }));
  };
}

export function deletePortfolio(portfolio_id) {
  // console.log(
  //   "frontend/src/redux/actions/portfolioActions: deletePortfolio: portfolio_id",
  //   portfolio_id
  // );
  return function (dispatch) {
    return deletePortfolioApi(portfolio_id)
      .then(() => {
        dispatch(deletePortfolioSuccess(portfolio_id));
      })
      .catch((error) => {
        throw error;
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

function loadPortfoliosListSuccess(portfolios) {
  return {
    type: LOAD_PORTFOLIOS_LIST_SUCCESS,
    portfolios,
  };
}

function loadPortfoliosFailure(error) {
  return {
    type: LOAD_PORTFOLIOS_FAILURE,
    payload: { porfoliosLoadedStatus: "failure", error },
  };
}

export function removePortfolios() {
  return function (dispatch) {
    dispatch(removePortfoliosSuccess());
  };
}

function createPortfolioSuccess(createdPortfolio) {
  const portfolio = createdPortfolio.portfolio;

  // console.log("createPortfolioSuccess: portfolio: ", portfolio);
  return {
    type: CREATE_PORTFOLIO_SUCCESS,
    portfolio,
  };
}

function updatePortfolioSuccess(updatedPortfolio) {
  const portfolio = updatedPortfolio.portfolio;
  return {
    type: UPDATE_PORTFOLIO_SUCCESS,
    portfolio,
  };
}

function deletePortfolioSuccess(portfolio_id) {
  return {
    type: DELETE_PORTFOLIO_SUCCESS,
    portfolio_id: parseInt(portfolio_id),
  };
}

function deletePortfolioOptimistic(portfolio_id) {
  return {
    type: DELETE_PORTFOLIO_OPTIMISTIC,
    portfolio_id: parseInt(portfolio_id),
  };
}

function removePortfoliosSuccess() {
  return {
    type: REMOVE_PORTFOLIOS_SUCCESS,
  };
}

// PUBLIC ACTIONS
export function createPortfolioPublic(portfolio) {
  const { existing } = portfolio;

  console.log("createPortfolioPublic: portfolio: ", portfolio);
  return function (dispatch) {
    existing
      ? dispatch(updatePortfolioSuccess({ portfolio }))
      : dispatch(createPortfolioSuccess({ portfolio }));
  };
}

export function deletePortfolioPublic(port_id) {
  return function (dispatch) {
    dispatch(deletePortfolioSuccess(port_id));
  };
}

export function savePublicPortfolios(portfolios) {
  return function (dispatch) {
    return savePublicPortfoliosApi(portfolios)
      .then((savedPortfolios) => {
        dispatch(savePublicPortfolioSuccess(savedPortfolios));
      })
      .catch((error) => {
        throw error;
      });
  };
}

function savePublicPortfolioSuccess(savedPortfolios) {
  const portfolios = savedPortfolios.publicPortfolios;
  return {
    type: ADD_PUBLIC_PORTFOLIO_SUCCESS,
    portfolios,
  };
}
