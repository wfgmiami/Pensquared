import { SEND_CONTACT_FORM_SUCCESS } from "./actionTypes";
import { sendContactForm as sendContactFormApi } from "../../api/contactFormApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function sendContactFormSuccess(contactForm) {
  return { type: SEND_CONTACT_FORM_SUCCESS, contactForm };
}

export function sendContactForm(contactForm) {
  return function (dispatch) {
    dispatch(beginApiCall());
    return sendContactFormApi(contactForm)
      .then((formSendResult) => {
        dispatch(sendContactFormSuccess(formSendResult));
      })
      .catch((error) => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}
