import React from "react";
import PropTypes from "prop-types";

const SignupPromptForm = ({ handleClose, onSignupConfirm }) => {
  let msgHeader = "Please sign up or sign in";
  let msgBody = "In order to save the transaction you need to have an account";

  return (
    <form onSubmit={onSignupConfirm}>
      <h4 style={{ textAlign: "center" }}>{msgHeader}</h4>
      <p>{msgBody}</p>
      &nbsp;
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>{" "}
      <button type="button" className="btn btn-secondary" onClick={handleClose}>
        Cancel
      </button>
    </form>
  );
};

SignupPromptForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onSignupConfirm: PropTypes.func.isRequired,
};

export default SignupPromptForm;
