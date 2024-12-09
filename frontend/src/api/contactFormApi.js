import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/api/contactform/";

export function sendContactForm(contactForm) {
  console.log("contact form: ", contactForm);
  return fetch(baseUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(contactForm),
  })
    .then(handleResponse)
    .catch(handleError);
}
