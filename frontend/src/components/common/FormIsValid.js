import PropTypes from "prop-types";

export function portfolioIsValid(portfolio, setErrors) {
  const { port_name } = portfolio;
  const errors = {};

  if (!port_name) errors.port_name = "Portfolio name is required.";
  setErrors(errors);
  return Object.keys(errors).length === 0;
}

portfolioIsValid.propTypes = {
  portfolio: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export function transactionIsValid(transaction, setErrors, rowIndex) {
  const { trade_date, shares, purchase_price } = transaction;
  const errors = {};

  if (!trade_date) errors.trade_date = "Trade date is required.";
  if (!shares) errors.shares = "Shares is required.";
  if (!purchase_price) errors.purchase_price = "Purchase price is required.";
  const isValid = Object.keys(errors).length === 0;
  if (!isValid) errors.row_index = rowIndex;

  setErrors(errors);
  return isValid;
}

export function brokerIsValid(broker, setErrors, rowIndex) {
  const { broker_name } = broker;
  const errors = {};

  if (!broker_name) errors.broker_name = "Broker name is required.";
  const isValid = Object.keys(errors).length === 0;
  if (!isValid) errors.row_index = rowIndex;

  setErrors(errors);
  return isValid;
}

export function contactFormIsValid(contactForm, setErrors) {
  const { email, message } = contactForm;
  const errors = {};

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isEmailValid) {
    errors.email = "Email address is not valid!";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  if (!message) errors.message = "Please enter a message!";
  setErrors(errors);
  return Object.keys(errors).length === 0;
}

export function signupFormIsValid(signupForm, setErrors) {
  const { email, password } = signupForm;
  const errors = {};
  // console.log("sign up ", signupForm);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isEmailValid) {
    errors.email = "Email address is not valid!";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  if (!password) errors.password = "Please enter a password!";
  setErrors(errors);
  return Object.keys(errors).length === 0;
}

export function signinFormIsValid(signinForm, setErrors) {
  const { email, password } = signinForm;
  const errors = {};
  // console.log("sign in ", signinForm);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isEmailValid) {
    errors.email = "Email address is not valid!";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  if (!password) errors.password = "Please enter a password!";
  setErrors(errors);
  return Object.keys(errors).length === 0;
}

export function symbolIsValid(symbol, setErrors) {
  const { symbol_name } = symbol;
  const errors = {};

  if (!symbol_name) errors.symbol_name = "Symbol is required.";
  setErrors(errors);
  return Object.keys(errors).length === 0;
}
