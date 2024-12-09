import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Header from "../common/Header";

const styles = (theme) => ({
  root: {},
  paper: {
    ...theme.mixins.gutters(),
    textAlign: "center",
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
});

function ContactFormSent(props) {
  const { classes } = props;

  return (
    <div>
      {/* <Header /> */}
      <Paper className={classes.paper} elevation={3}>
        Thank you for contacting us. We will get back to you shortly
      </Paper>
    </div>
  );
}

ContactFormSent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContactFormSent);
