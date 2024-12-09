import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Header from "../common/Header";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ContactForm({ submitContactForm, errors, sending }) {
  const classes = useStyles();
  const [contactForm, setContactForm] = useState({
    email: "",
    message: "",
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setContactForm({ ...contactForm, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    submitContactForm(contactForm);
  };
  return (
    <Container component="main" maxWidth="sm">
      {/* <Header /> */}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          CONTACT FORM
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="field">
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="alert alert-danger">{errors.email}</div>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="field">
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="message"
                  label="You Message"
                  name="message"
                  autoComplete="message"
                  multiline
                  rows="5"
                  onChange={handleChange}
                />
                {errors.message && (
                  <div className="alert alert-danger">{errors.message}</div>
                )}
              </div>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {sending ? "SENDING..." : "SEND MESSAGE"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
