import { combineReducers } from "redux";
import portfolios from "./portfolioReducer";
import holdings from "./holdingReducer";
import brokers from "./brokerReducer";
import contact from "./contactReducer";
import user from "./userReducer";
import apiCallsInProgress from "./apiStatusReducer";
import transactions from "./transactionReducer";

const rootReducer = combineReducers({
  portfolios,
  holdings,
  brokers,
  contact,
  user,
  apiCallsInProgress,
  transactions,
});

export default rootReducer;
