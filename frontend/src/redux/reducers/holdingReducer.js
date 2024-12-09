import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function holdingReducer(state = initialState.holdings, action) {
  let port_id, deleteSymbol, portHold;
  console.log("action: ", action);
  switch (action.type) {
    case types.LOAD_PORTFOLIO_HOLDINGS_SUCCESS:
      return {
        ...state,
        holdingsList: action.holdings,
      };
    case types.REMOVE_HOLDINGS_SUCCESS:
      return {
        ...state,
        holdingsList: [],
      };
    case types.DELETE_HOLDINGS_SUCCESS:
      port_id = action.deleteHolding.port_id;
      deleteSymbol = action.deleteHolding.symbol;

      portHold = state.holdingsList.find(
        (hold) => parseInt(Object.keys(hold)) === parseInt(port_id)
      )[`${port_id}`];

      return {
        ...state,
        holdingsList: [
          ...state.holdingsList.filter(
            (hold) => parseInt(Object.keys(hold)) !== parseInt(port_id)
          ),
          {
            [`${port_id}`]: [
              ...portHold.filter((hold) => hold.symbol !== deleteSymbol),
            ],
          },
        ],
      };
    case types.ADD_PUBLIC_HOLDING_SUCCESS:
      port_id = action.payload.port_id;

      portHold = state.holdingsList.find(
        (hold) => parseInt(Object.keys(hold)) === parseInt(port_id)
      );

      return {
        ...state,

        holdingsList: portHold
          ? [
              ...state.holdingsList.filter(
                (hold) => parseInt(Object.keys(hold)) !== parseInt(port_id)
              ),
              {
                [`${port_id}`]: [
                  ...state.holdingsList.find(
                    (hold) => parseInt(Object.keys(hold)) === parseInt(port_id)
                  )[`${port_id}`],
                  action.payload,
                ],
              },
            ]
          : [...state.holdingsList, { [`${port_id}`]: [action.payload] }],
      };

    case types.REMOVE_PUBLIC_HOLDINGS_SUCCESS:
      port_id = action.deleteHolding.port_id;
      deleteSymbol = action.deleteHolding.symbol;

      portHold = state.holdingsList.find(
        (hold) => parseInt(Object.keys(hold)) === parseInt(port_id)
      )[`${port_id}`];

      return {
        ...state,
        holdingsList: [
          ...state.holdingsList.filter(
            (hold) => parseInt(Object.keys(hold)) !== parseInt(port_id)
          ),
          {
            [`${port_id}`]: [
              ...portHold.filter((hold) => hold.symbol !== deleteSymbol),
            ],
          },
        ],
      };
    case types.REMOVE_ALL_PUBLIC_HOLDINGS_SUCCESS:
      port_id = action.deleteHolding.port_id;
      return {
        ...state,
        holdingsList: [
          ...state.holdingsList.filter(
            (hold) => parseInt(Object.keys(hold)) !== parseInt(port_id)
          ),
        ],
      };

    default:
      return state;
  }
}
