import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/api/auth/";

export function sendSignupForm(signupForm) {
  // console.log("signupForm: ", signupForm);
  return fetch(baseUrl + "register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(signupForm),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function sendSigninForm(signinForm) {
  // console.log("signinForm: ", signinForm);
  return fetch(baseUrl + "signin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(signinForm),
  })
    .then(handleResponse)
    .catch(handleError);
}
