import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const initialState = {
  user: {
    signupError: "",
    signinError: "",
    signoutError: "",
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

export default function configureStore() {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}
