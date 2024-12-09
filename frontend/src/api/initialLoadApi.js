import { handleResponse, handleError } from "./apiUtils";

export function initialLoad(user_id) {
  const baseUrl = process.env.API_URL + `/api/load/${user_id}`;
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}
