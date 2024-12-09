import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import ContactForm from "./ContactForm";
import { sendContactForm } from "../../redux/actions/contactActions";
import PropTypes from "prop-types";
import Header from "../common/Header";
import { contactFormIsValid } from "../common/FormIsValid";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function ContactPage() {
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [isContactFormSent, setIsContactFormSent] = useState(false);

  const dispatch = useDispatch();
  const classes = useStyles();

  function submitContactForm(contactForm) {
    if (!contactFormIsValid(contactForm, setErrors)) return;

    setSending(true);
    dispatch(sendContactForm(contactForm))
      .then((result) => {
        setSending(false);
        setIsContactFormSent(true);
        // resetOnClose();
      })
      .catch((error) => {
        setSending(false);
        setErrors({ onSave: error.message });
        // resetOnClose();
      });
  }

  // console.log("contact page props", this.props, this.state);
  return (
    <div className={classes.paper}>
      {/* <Header /> */}
      {isContactFormSent ? (
        <Redirect to="/contactus/sent" />
      ) : (
        <ContactForm
          sending={sending}
          errors={errors}
          submitContactForm={submitContactForm}
        />
      )}
    </div>
  );
}

export default ContactPage;
