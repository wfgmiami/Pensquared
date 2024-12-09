import * as types from "../actions/actionTypes";

export default function userReducer(state = {}, action) {
  // console.log("userReducer: action: ", action, " state: ", state);
  switch (action.type) {
    case types.SEND_SIGNUP_FORM_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
      };
    case types.SEND_SIGNUP_FORM_FAILURE:
      return {
        ...state,
        signupError: action.error,
      };
    case types.CLEAR_SIGNUP_ATTEMPT_SUCCESS:
      return {
        ...state,
        signupError: "",
      };
    case types.SIGNIN_SUCCESS:
      return {
        userInfo: action.payload,
      };
    case types.SIGNIN_FAILURE:
      return {
        ...state,
        signinError: action.error,
      };
    case types.CLEAR_SIGNIN_ATTEMPT_SUCCESS:
      return {
        ...state,
        signinError: "",
      };
    case types.SIGNOUT_SUCCESS:
      return {
        userInfo: null,
      };

    default:
      return state;
  }
}
