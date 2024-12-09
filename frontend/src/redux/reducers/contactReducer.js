import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function contactReducer(state = initialState.contact, action) {
  switch (action.type) {
    case types.SEND_CONTACT_FORM_SUCCESS:
      return { ...state, isContactFormSent: true };
    default:
      return state;
  }
}
