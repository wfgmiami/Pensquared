import {
  LOAD_BROKERS_SUCCESS,
  LOAD_BROKERS_FAILURE,
  ADD_BROKER_SUCCESS,
  UPDATE_BROKER_SUCCESS,
  DELETE_BROKER_SUCCESS,
  DELETE_BROKER_OPTIMISTIC,
  REMOVE_BROKERS_SUCCESS,
  ADD_PUBLIC_BROKER_SUCCESS,
} from "./actionTypes";

import {
  loadBrokers as loadBrokersApi,
  loadBrokersSelect as loadBrokersSelectApi,
  addBroker as addBrokerApi,
  deleteBroker as deleteBrokerApi,
  deleteBrokerOptimistic as deleteBrokerOptimisticApi,
  loadBroker as loadBrokerApi,
  savePublicBrokers as savePublicBrokersApi,
} from "../../api/brokerApi";

export function loadBrokers(user_id) {
  return function (dispatch) {
    return loadBrokersApi(user_id)
      .then((brokersData) => {
        dispatch(loadBrokersSuccess(brokersData));
      })
      .catch((error) => {
        dispatch(loadBrokersFailure(error));
      });
  };
}

export function addBroker(broker) {
  const { broker_id } = broker;

  return function (dispatch) {
    return addBrokerApi(broker)
      .then((addedBroker) => {
        broker_id
          ? dispatch(updateBrokerSuccess(addedBroker))
          : dispatch(addBrokerSuccess(addedBroker));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function updateReduxBroker(broker) {
  return function (dispatch) {
    dispatch(updateBrokerSuccess({ broker }));
  };
}

export function deleteBroker(broker_id) {
  return function (dispatch) {
    return deleteBrokerApi(broker_id)
      .then(() => {
        dispatch(deleteBrokerSuccess(broker_id));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function removeBrokers() {
  return function (dispatch) {
    dispatch(removeBrokersSuccess());
  };
}

function loadBrokersSuccess(brokersData) {
  const brokers = brokersData.data.brokers;
  return {
    type: LOAD_BROKERS_SUCCESS,
    payload: { brokers, brokersLoadedStatus: "success" },
  };
}

function loadBrokersFailure(error) {
  return {
    type: LOAD_BROKERS_FAILURE,
    payload: { porfoliosLoadedStatus: "failure", error },
  };
}

function addBrokerSuccess(addedBroker) {
  const broker = addedBroker.broker;
  return {
    type: ADD_BROKER_SUCCESS,
    broker,
  };
}

function updateBrokerSuccess(addedBroker) {
  const broker = addedBroker.broker;
  return {
    type: UPDATE_BROKER_SUCCESS,
    broker,
  };
}

function deleteBrokerSuccess(broker_id) {
  return {
    type: DELETE_BROKER_SUCCESS,
    broker_id: parseInt(broker_id),
  };
}

function deleteBrokerOptimistic(broker_id) {
  return {
    type: DELETE_BROKER_OPTIMISTIC,
    broker_id: parseInt(broker_id),
  };
}

function removeBrokersSuccess() {
  return {
    type: REMOVE_BROKERS_SUCCESS,
  };
}

// PUBLIC ACTIONS
export function addBrokerPublic(broker) {
  const { existing } = broker;
  console.log("addBrokerPublic: broker: ", broker);
  return function (dispatch) {
    existing
      ? dispatch(updateBrokerSuccess({ broker }))
      : dispatch(addBrokerSuccess({ broker }));
  };
}

export function deleteBrokerPublic(broker_id) {
  return function (dispatch) {
    dispatch(deleteBrokerSuccess(broker_id));
  };
}

export function savePublicBrokers(brokers) {
  return function (dispatch) {
    return savePublicBrokersApi(brokers)
      .then((savedBrokers) => {
        dispatch(savePublicBrokerSuccess(savedBrokers));
      })
      .catch((error) => {
        throw error;
      });
  };
}

function savePublicBrokerSuccess(savedBrokers) {
  const brokers = savedBrokers.publicBrokers;
  return {
    type: ADD_PUBLIC_BROKER_SUCCESS,
    brokers,
  };
}
