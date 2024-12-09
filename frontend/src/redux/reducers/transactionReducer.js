import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function transactionReducer(
  state = initialState.transactions,
  action
) {
  // console.log("action: ", action);

  switch (action.type) {
    case types.LOAD_BUY_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        buyTransactions: action.buyTransactions,
      };
    case types.REMOVE_BUY_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        buyTransactions: [],
      };
    case types.ADD_BUY_TRANSACTION_SUCCESS:
      return {
        ...state,
        buyTransactions: [...state.buyTransactions, ...action.buyTransaction],
      };

    case types.UPDATE_BUY_TRANSACTION_SUCCESS:
      return {
        ...state,
        buyTransactions: [
          ...state.buyTransactions.map((trans) =>
            trans.trans_buy_id === action.updatedTransaction.trans_buy_id
              ? action.updatedTransaction
              : trans
          ),
        ],
      };
    case types.DELETE_BUY_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        buyTransactions: [
          ...state.buyTransactions.filter(
            (trans) => trans.trans_buy_id !== action.trans_buy_id
          ),
        ],
      };
    case types.DELETE_HOLDING_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        buyTransactions: [
          ...state.buyTransactions.filter(
            (trans) => trans.port_id !== action.deleteHolding.port_id
          ),
          ...state.buyTransactions.filter(
            (trans) => trans.symbol !== action.deleteHolding.symbol
          ),
        ],
      };
    case types.DELETE_PORT_HOLDING_TRANS_SUCCESS:
      return {
        ...state,
        buyTransactions: [
          ...state.buyTransactions.filter(
            (trans) => trans.port_id !== action.deleteHolding.port_id
          ),
          ...state.buyTransactions.filter(
            (trans) => trans.symbol !== action.deleteHolding.symbol
          ),
        ],
      };
    default:
      return state;
  }
}
