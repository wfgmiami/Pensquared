import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function brokerReducer(state = initialState.brokers, action) {
  // console.log("reducer broker: ", action);

  switch (action.type) {
    case types.LOAD_BROKERS_SUCCESS:
      return {
        ...state,
        brokersList: [...action.payload.brokers],
        brokersLoadStatus: action.payload.brokersLoadStatus,
      };

    case types.LOAD_BROKERS_FAILURE:
      return {
        ...state,
        brokersLoadedStatus: action.payload.brokersLoadedStatus,
        error: action.payload.error,
      };

    case types.ADD_BROKER_SUCCESS:
      return {
        ...state,
        brokersList: [...state.brokersList, action.broker],
      };

    case types.UPDATE_BROKER_SUCCESS:
      return {
        ...state,
        brokersList: [
          ...state.brokersList.map((broker) =>
            broker.broker_id === action.broker.broker_id
              ? action.broker
              : broker
          ),
        ],
      };

    case types.DELETE_BROKER_SUCCESS:
      return {
        ...state,
        brokersList: [
          ...state.brokersList.filter(
            (broker) => broker.broker_id !== action.broker_id
          ),
        ],
      };

    case types.REMOVE_BROKERS_SUCCESS:
      return {
        ...state,
        brokersList: [],
      };
    case types.ADD_PUBLIC_BROKER_SUCCESS:
      return {
        ...state,
        brokersList: [...action.brokers],
      };
    default:
      return state;
  }
}
