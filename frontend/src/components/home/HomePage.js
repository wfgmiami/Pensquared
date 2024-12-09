import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" to="">
        muistocks
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    padding: theme.spacing(8),
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(2),
    backgroundColor: "#e9ecef",
  },
  btn: {
    textAlign: "center",
    marginTop: theme.spacing(10),
    // marginBottom: theme.spacing(8),
  },
  mainText: {
    marginTop: theme.spacing(4),
  },
  footer: {
    padding: theme.spacing(1, 1),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
}));

export default function HomePage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="lg">
        {/* <Typography variant="h2" component="h1" gutterBottom>

        </Typography> */}
        <Typography variant="h5" component="h2" gutterBottom>
          {"Create portfolios and keep track of your investments"}
        </Typography>
        {/* <Typography variant="h5" component="h2" gutterBottom>
          {
            "Material UI was used to create the webapp and that why it is called MUISTOCKS"
          }
        </Typography> */}
        <div className={classes.mainText}>
          <p>
            Our goal is to provide all investors with a free and easy way to
            organize investments, track changes to their positions and risk
            exposure.
          </p>

          <p>
            You can create portfolios, add or remove transactions, and get price
            updates on all your investments. The prices will be updated
            periodically or you can refresh them at any time.
          </p>
          <p>
            {" "}
            You can also add brokers to the portfolio transaction and keep track
            of the positions by broker.
          </p>

          <p>
            In order to save your portfolios and transactions you will need to{" "}
            <a href="signup">sign up</a> - It is easy and free.
          </p>
        </div>
        <div className={classes.btn}>
          <Link to="portfolios" className="btn btn-primary btn-lg">
            CREATE PORTFOLIO
          </Link>
        </div>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="lg">
          <Typography variant="body1"></Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}
