import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
// import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import SigninForm from "./SigninForm";
import {
  sendSigninForm,
  clearSigninAttempt,
} from "../../redux/actions/userActions";
import { signinFormIsValid } from "../common/FormIsValid";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function SigninPage() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [errors, setErrors] = useState({});
  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  });

  const signinError = useSelector((state) => state.user.signinError);
  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  useEffect(() => {
    return () => dispatch(clearSigninAttempt());
  }, []);

  useEffect(() => {
    if (signinError) {
      const serverError = { onSave: signinError };
      setErrors(serverError);
    }
  }, [signinError]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setErrors({});
    dispatch(clearSigninAttempt());
    setSigninForm({ ...signinForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitSigninForm(signinForm);
  };

  function submitSigninForm(signinForm) {
    if (!signinFormIsValid(signinForm, setErrors)) return;

    dispatch(sendSigninForm(signinForm));
  }

  return (
    <div className={classes.paper}>
      {userInfo ? (
        <Redirect
          to={{
            pathname: "/portfolios",
            state: { referrerPage: "signinPage" },
          }}
        />
      ) : (
        <SigninForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </div>
  );
}
