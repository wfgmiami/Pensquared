import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/api/brokers/";

export function loadBrokers(user_id) {
  // console.log("brokerApi: loadBrokers: user_id: ",user_id);
  return fetch(baseUrl + "/user/" + user_id || "")
    .then(handleResponse)
    .catch(handleError);
}

export function loadBrokersSelect() {
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}

export function loadBroker(broker_id) {
  return fetch(`${baseUrl}/${broker_id}`)
    .then(handleResponse)
    .catch(handleError);
}

export function addBroker(broker) {
  const { broker_id } = broker;

  return fetch(baseUrl + (broker_id || ""), {
    method: broker_id ? "PUT" : "POST", // POST for create, PUT to update when id already exists.
    headers: { "content-type": "application/json" },
    body: JSON.stringify(broker),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteBroker(broker_id) {
  return fetch(baseUrl + broker_id, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteBrokerOptimistic(broker_id) {
  return fetch(baseUrl + broker_id, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}

// PUBLIC
export function savePublicBrokers(brokers) {
  return fetch(baseUrl + "public", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(brokers),
  })
    .then(handleResponse)
    .catch(handleError);
}
