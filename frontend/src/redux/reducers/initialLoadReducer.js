import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function initialLoadReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case types.INITIAL_LOAD_SUCCESS:
      return {
        ...state.transactions,
        buyTransactions: action.buyTransactions,
      };

    default:
      return state;
  }
}


export default {
  apiCallsInProgress: 0,
  contact: { isContactFormSent: false },
  portfolios,
  brokers,
  holdings,
  transactions,
};
