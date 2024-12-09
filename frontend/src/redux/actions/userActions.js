import {
  SEND_SIGNUP_FORM_SUCCESS,
  SEND_SIGNUP_FORM_FAILURE,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  SIGNOUT_SUCCESS,
  CLEAR_SIGNIN_ATTEMPT_SUCCESS,
  CLEAR_SIGNUP_ATTEMPT_SUCCESS,
} from "./actionTypes";
import {
  sendSignupForm as sendSignupFormApi,
  sendSigninForm as sendSigninFormApi,
} from "../../api/userApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function sendSignupForm(signupForm) {
  return function (dispatch) {
    dispatch(beginApiCall());
    return sendSignupFormApi(signupForm)
      .then((data) => {
        localStorage.setItem("userInfo", JSON.stringify(data));
        dispatch(sendSignupFormSuccess(data));
      })
      .catch((error) => {
        dispatch(apiCallError(error));
        dispatch(sendSignupFormFailure(error));
        // throw error;
      });
  };
}

export function clearSignupAttempt() {
  return function (dispatch) {
    dispatch(clearSignupAttemptSuccess());
  };
}

export function sendSigninForm(signinForm) {
  return function (dispatch) {
    dispatch(beginApiCall());
    return sendSigninFormApi(signinForm)
      .then((data) => {
        localStorage.setItem("userInfo", JSON.stringify(data));
        dispatch(signInSuccess(data));
      })
      .catch((error) => {
        dispatch(apiCallError(error));
        dispatch(signInFailure(error));
        // throw error;
      });
  };
}

export function clearSigninAttempt() {
  return function (dispatch) {
    dispatch(clearSigninAttemptSuccess());
  };
}

export function signOutUser() {
  return function (dispatch) {
    localStorage.removeItem("userInfo");
    dispatch(signOutUserSuccess());
  };
}

function sendSignupFormSuccess(data) {
  return { type: SEND_SIGNUP_FORM_SUCCESS, payload: data };
}

function sendSignupFormFailure(error) {
  return { type: SEND_SIGNUP_FORM_FAILURE, error: error.message };
}

function clearSignupAttemptSuccess() {
  return { type: CLEAR_SIGNUP_ATTEMPT_SUCCESS };
}

function signInSuccess(data) {
  return { type: SIGNIN_SUCCESS, payload: data };
}

function signInFailure(error) {
  return { type: SIGNIN_FAILURE, error: error.message };
}

function clearSigninAttemptSuccess() {
  return { type: CLEAR_SIGNIN_ATTEMPT_SUCCESS };
}

function signOutUserSuccess() {
  return { type: SIGNOUT_SUCCESS };
}
