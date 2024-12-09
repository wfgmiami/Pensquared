import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import HoldingsTable from "./holdings/HoldingsTable";
import PortfoliosTable from "./portfolios/PortfoliosTable";
import BrokersTable from "./brokers/BrokersTable";
import HomePage from "./home/HomePage";
import SigninPage from "./signin/SigninPage";
import SignupPage from "./signin/SignupPage";
import ContactPage from "./contact/ContactPage";
import ContactFormSent from "./contact/ContactFormSent";
import Header from "./common/Header";

function App() {
  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  return (
    <Switch>
      <>
        <Header userInfo={userInfo} />
        <Route exact path="/" component={HomePage} />
        <Route
          exact
          path="/portfolios"
          render={(props) => <PortfoliosTable {...props} />}
        />
        <Route
          exact
          path="/portfolios/:port_name/:port_id"
          component={HoldingsTable}
        />
        <Route exact path="/brokers" component={BrokersTable} />
        <Route exact path="/signin" component={SigninPage} />
        <Route exact path="/signup" component={SignupPage} />
        <Route exact path="/contactus" component={ContactPage} />
        <Route exact path="/contactus/sent" component={ContactFormSent} />
      </>
    </Switch>
  );
}

export default App;
