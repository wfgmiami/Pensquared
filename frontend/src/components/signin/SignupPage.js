import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
// import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import SignupForm from "./SignupForm";
import {
  sendSignupForm,
  clearSignupAttempt,
} from "../../redux/actions/userActions";

import { signupFormIsValid } from "../common/FormIsValid";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function SignupPage() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const signupError = useSelector((state) => state.user.signupError);
  const userInfo = useSelector((state) => state.user.userInfo);

  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }

  useEffect(() => dispatch(clearSignupAttempt()), []);

  useEffect(() => {
    if (signupError) {
      const serverError = { onSave: signupError };
      setErrors(serverError);
    }
  }, [signupError]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setErrors({});
    dispatch(clearSignupAttempt());
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitSignupForm(signupForm);
  };

  function submitSignupForm(signupForm) {
    if (!signupFormIsValid(signupForm, setErrors)) return;

    dispatch(sendSignupForm(signupForm));
  }

  // console.log("contact page props", this.props, this.state);
  return (
    <div className={classes.paper}>
      {userInfo ? (
        <Redirect
          to={{
            pathname: "/portfolios",
            state: { referrerPage: "signupPage" },
          }}
        />
      ) : (
        <SignupForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </div>
  );
}
