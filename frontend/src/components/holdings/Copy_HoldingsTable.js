import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import TransactionsRows from "../transactions/TransactionsRows";
import { loadPortfolioHoldings } from "../../redux/actions/holdingActions";
import {
  getQuotes as getQuotesApi,
  updatePrices as updatePricesApi,
} from "../../api/marketDataApi";
import { deleteTransaction as deleteTransactionApi } from "../../api/transactionApi";
import { deletePortfolioHolding as deleteHoldingApi } from "../../api/holdingApi";
import { loadBrokers } from "../../redux/actions/brokerActions";
import {
  removeHoldings,
  removePublicHolding,
} from "../../redux/actions/holdingActions";
import { updateReduxPortfolio } from "../../redux/actions/portfolioActions";

import {
  loadBuyTransactions,
  removeBuyTransactions,
  updateBuyTransaction,
  deleteBuyTransaction,
  deleteHoldingTransactions,
} from "../../redux/actions/transactionActions";

import DeleteForm from "./DeleteForm";
import SignupPromptForm from "./SignupPromptForm";
import Modal from "../common/Modal";
import AddSymbol from "./AddSymbol";
import SyncIcon from "@material-ui/icons/Sync";
import { numTwoDecimal, strRemoveComma } from "../common/NumberFormat";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    // frezes the holdings header
    maxHeight: 850,
    // minWidth: 650,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    minHeight: "40px!important", //gap between the header and the table
    justifyContent: "flex-end",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);

function HoldingsTable(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const [holdings, setHoldings] = useState([]);
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);

  const [prices, setPrices] = useState({});
  const [refreshSpinner, setRefreshSpinner] = useState(null);
  const [isDeleteTransOpen, toggleDeleteTransaction] = useState(false);
  const [isDeleteHoldOpen, toggleDeleteHolding] = useState(false);
  const [deleteTransaction, setDeleteTransaction] = useState({});
  const [deleteHolding, setDeleteHolding] = useState();
  const [isAddSymbolOpen, toggleAddSymbol] = useState(false);
  const [transactionsLeft, setTransactionsLeft] = useState();
  const [isPublicSaveTransOpen, togglePublicSaveTransOpen] = useState(false);

  const holdingsList = useSelector((state) => state.holdings.holdingsList);

  // const portfolios = useSelector((state) => state.portfolios.portfoliosList);
  const brokers = useSelector((state) => state.brokers.brokersList);
  const publicHoldings = useSelector((state) => state.holdings.publicHoldings);
  const userInfo = useSelector((state) => state.user.userInfo);

  const buyTransactions = useSelector(
    (state) => state.transactions.buyTransactions
  );

  const { match } = props;
  const port_id = match.params.port_id;
  const port_name = match.params.port_name;

  let user_id = null;

  // if (portfolios.length > 0) {
  //   const port = portfolios.filter(
  //     (port) => port.port_id === parseInt(port_id)
  //   );
  //   port_name = port[0].port_name;
  // }

  if (userInfo) {
    user_id = userInfo.user_id;
  }

  const updatingAllPrice = refreshSpinner === "all";

  console.log("HoldingsTable: holdings: ", holdings);

  // should trigger on initial load and on buyTransactions updates
  // useEffect(() => {
  //   // console.log("useEffect [buyTransactions]:", buyTransactions);
  //   if (user_id) {
  //     const portBuyTransactions = buyTransactions.filter(
  //       (trans) => trans.port_id === parseInt(port_id)
  //     );

  //     const portSymbols = [
  //       ...new Set(portBuyTransactions.map((trans) => trans.symbol)),
  //     ];
  //     // symbol & broker_id
  //     const portSymbolsNoNulls = portSymbols.filter((symbol) => symbol);

  //     const portHoldings = portSymbolsNoNulls.map((symbol) => {
  //       return portBuyTransactions.reduce(
  //         (hold, trans) => {
  //           if (symbol === trans.symbol) {
  //             hold["shares"] += trans.shares;
  //             hold["current_price"] = trans.current_price;
  //             // hold["book_value"] += numTwoDecimal(trans.book_value);
  //             hold["book_value"] += trans.book_value;

  //             isNaN(hold["book_value"] / hold["shares"])
  //               ? (hold["avg_cost_per_share"] = 0)
  //               : (hold["avg_cost_per_share"] =
  //                   hold["book_value"] / hold["shares"]);

  //             // hold["market_value"] += numTwoDecimal(trans.market_value);
  //             hold["market_value"] += trans.market_value;
  //             hold["ugl"] += trans.gain_loss;
  //           }
  //           return hold;
  //         },
  //         {
  //           symbol,
  //           current_price: 0,
  //           shares: 0,
  //           avg_cost_per_share: 0,
  //           market_value: 0,
  //           book_value: 0,
  //           ugl: 0,
  //           port_id: parseInt(port_id),
  //           port_name,
  //         }
  //       );
  //     });

  //     setHoldings(portHoldings);
  //   } else {
  //     // for public view i have another state - publicHoldings, that is not save in db
  //     setHoldings(() =>
  //       publicHoldings.filter((hold) => hold.port_id === port_id)
  //     );
  //   }
  // }, [buyTransactions]);

  useEffect(() => {
    if (user_id) {
      const portHold = holdingsList.filter(
        (hold) => parseInt(Object.keys(hold)) === parseInt(port_id)
      )[0][`${port_id}`];
      setPortfolioHoldings(portHold);
    }
  }, [holdingsList]);

  const updatePortfolios = () => {
    const numHoldings = holdings.length;
    const portHoldings = holdings.reduce(
      (portVal, curVal) => {
        if (curVal.market_value && curVal.book_value) {
          portVal["mv"] += parseFloat(curVal.market_value);
          portVal["bv"] += parseFloat(curVal.book_value);
          let ugl =
            parseFloat(curVal.market_value) - parseFloat(curVal.book_value);
          portVal["ugl"] += Math.round(ugl * 100) / 100;
        }
        return portVal;
      },
      { mv: 0, bv: 0, ugl: 0 }
    );

    const updatedPortfolio = {
      asset_class: "Equity",
      currency: "USD",
      mv: portHoldings.mv,
      port_id: parseInt(port_id),
      port_name,
      symbols: numHoldings,
      ugl: portHoldings.ugl,
      user_id,
    };
    console.log("updatePortfolios: updatedPortfolio: ", updatedPortfolio);

    dispatch(updateReduxPortfolio(updatedPortfolio));
  };

  const updateBrokers = () => {
    // const numHoldings = holdings.length;
    const broker_ids = brokers.map((brk) => brk.broker_id);

    //LOOP THROUGH BROKER IDS AND ACCUMULATE MV,UGL FROM ROWS BASED ON EACH BROKER ID
    // WILL SEND TO ACTION AN ARRAY OF BROKER OBJECTS
    // AS OPPOSED TO PORTFOLIO UPDATE WHERE IT WAS JUST ONE PORTFOLIO OBJECT TO UPDATE

    // const brokerHoldings = broker_ids.map((brkId) => {
    //   return rows.reduce(
    //     (brokerVal, curVal) => {
    //       console.log("brkId", brkId, "curVal: ", curVal);

    //       brokerVal["broker_id"] = brkId;
    //       brokerVal["user_id"] = user_id;

    //       if (
    //         curVal.market_value &&
    //         curVal.book_value &&
    //         curVal.broker_id === brkId
    //       ) {
    //         brokerVal["mv"] += parseFloat(curVal.market_value);
    //         brokerVal["bv"] += parseFloat(curVal.book_value);
    //         brokerVal["ugl"] += parseFloat(curVal.gain_loss);
    //         brokerVal["symbols"] += 1;
    //         brokerVal["broker_acc_number"] = curVal.broker_acc_number;
    //         brokerVal["broker_name"] = curVal.broker;
    //       }
    //       return brokerVal;
    //     },
    //     {
    //       broker_id: null,
    //       broker_acc_number: null,
    //       broker_name: null,
    //       user_id: null,
    //       symbols: 0,
    //       mv: 0,
    //       bv: 0,
    //       ugl: 0,
    //     }
    //   );
    // });
    // console.log("brokerHoldings: ", brokerHoldings);
    // const port = portfolios.filter(
    //   (port) => port.port_id === parseInt(port_id)
    // );
    // port_name = port[0].port_name;

    // const updatedBroker = {
    //   broker_acc_number: brokerHoldings.broker_acc_number,
    //   broker_id: brokerHoldings.broker_id,
    //   broker_name: "",
    //   mv: brokerHoldings.mv,
    //   symbols: brokerHoldings,
    //   ugl: brokerHoldings.ugl,
    //   user_id,
    // };

    // dispatch(updateReduxBroker(updatedBroker));
  };

  // single symbol market price refresh
  const refreshPrice = async (row) => {
    setRefreshSpinner(row.symbol);
    const symbol = [row.symbol];
    // // get the price from py yahoo
    const addSymbolGetPrice = await getQuotesApi(symbol);
    setRefreshSpinner(null);
    const quote = addSymbolGetPrice.quotes;
    const splitData = quote.split(":");
    const priceData = splitData[1].trim();
    let updatedPrice = priceData.slice(0, -1);

    setPrices((prev) => {
      return { ...prev, [symbol]: updatedPrice };
    });

    // update the local holdings state
    setHoldings((prev) =>
      prev.map((holding) => {
        if (holding.symbol === symbol[0]) {
          return {
            ...holding,
            current_price: updatedPrice,
            market_value: updatedPrice * holding.shares,
          };
        }
        return holding;
      })
    );

    // update the currentprice table
    updatePrices({ [symbol[0]]: updatedPrice });
  };

  // update the currentprice table
  const updatePrices = async (quotes) => {
    try {
      await updatePricesApi(quotes);
    } catch (error) {
      console.log(error);
    }
  };

  const getQuotes = async () => {
    let symbols = [];
    if (publicHoldings.length > 0) {
      symbols = publicHoldings.map((holding) => holding.symbol);
    } else {
      symbols = holdings.map((holding) => holding.symbol);
    }

    try {
      setRefreshSpinner("all");
      const data = await getQuotesApi(symbols);

      // quotes = { AAL: "11", AAPL: "140" };
      let quotes = data.quotes;
      const numQuotes = Object.keys(quotes).length;

      setPrices(() => quotes);

      // update the local holdings state
      setHoldings((prev) =>
        prev.map((hold) => {
          let current_price = quotes[hold.symbol];
          let market_value = quotes[hold.symbol] * hold.shares;

          const updatedHolding = {
            ...hold,
            current_price,
            market_value,
          };
          setRefreshSpinner(null);

          return updatedHolding;
        })
      );

      // update the currentprice table
      updatePrices(quotes);
    } catch (error) {
      console.log(error);
    }
  };

  // --- DELETE FUNCTIONS ---
  // DELETE TRANSACTION
  // when trash bin icon is click for a transaction
  const handleDeleteTransaction = (row, rowsLength) => {
    setDeleteTransaction(row);
    setTransactionsLeft(rowsLength);

    toggleDeleteTransaction(!isDeleteTransOpen);
  };

  // after the user confirms the delete on the modal prompt
  const onDeleteTransConfirm = (e) => {
    e.preventDefault();

    // removing from the state newly added transaction that was not saved to db
    if (!deleteTransaction.shares) {
      // remove the holding if the last transaction is deleted

      if (transactionsLeft === 1) {
        const holding = { symbol: deleteTransaction.symbol };
        dispatch(removePublicHolding(holding));

        setHoldings((prev) =>
          prev.filter((holding) => holding.symbol !== deleteTransaction.symbol)
        );
      }
      setDeleteTransaction((prev) => ({ ...prev, confirmDelete: true }));
    } else {
      dispatch(deleteBuyTransaction(deleteTransaction));
      setDeleteTransaction((prev) => ({ ...prev, confirmDelete: true }));
      // deleteTransactionCall(deleteTransaction);
    }

    toggleDeleteTransaction(!isDeleteTransOpen);
  };

  // DELETE HOLDING
  // when trash bin icon is click for a holding
  const handleDeleteHolding = (holding) => {
    setDeleteHolding(holding);
    toggleDeleteHolding(!isDeleteHoldOpen);
  };

  // after the user confirms the delete on the modal prompt
  const onDeleteHoldConfirm = (e) => {
    e.preventDefault();

    if (!deleteHolding.shares && !user_id) {
      // remove the holding if the holdings has 0 shares and no user_id - case with public holdings
      dispatch(removePublicHolding(deleteHolding));
      setHoldings((prev) =>
        prev.filter((holding) => holding.symbol !== deleteHolding.symbol)
      );
    } else {
      console.log("deleteHolding: ", deleteHolding);
      dispatch(deleteHoldingTransactions(deleteHolding));

      // deleteHoldingCall(deleteHolding);
    }

    toggleDeleteHolding(!isDeleteHoldOpen);
  };

  // API call to delete holding
  const deleteHoldingCall = async (deleteHolding) => {
    const deleteHoldingSymbol = deleteHolding.symbol;

    try {
      const response = await deleteHoldingApi(deleteHolding);

      setHoldings((prev) =>
        prev.filter((holding) => holding.symbol !== deleteHoldingSymbol)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onSignupConfirm = () => {
    history.push("/signin");
  };

  const convertToNum = (row) => {
    let newRow = { ...row };

    for (const prop in row) {
      if (
        prop === "book_value" ||
        prop === "gain_loss" ||
        prop === "market_value" ||
        prop === "purchase_price"
      ) {
        if (typeof row[prop] === "string") {
          newRow[prop] = parseFloat(strRemoveComma(row[prop]));
        }
      }
    }
    return newRow;
  };

  // --- SAVE NEW OR EXISTING TRANSACTION FUNCTIONS ---
  const updateTransaction = (row) => {
    const newRow = convertToNum(row);
    dispatch(updateBuyTransaction(newRow));
  };

  return (
    <>
      <Modal
        show={isDeleteTransOpen}
        handleClose={() => toggleDeleteTransaction(!isDeleteTransOpen)}
      >
        <DeleteForm
          transactionId={
            deleteTransaction ? deleteTransaction.trans_buy_id : ""
          }
          handleClose={() => toggleDeleteTransaction(!isDeleteTransOpen)}
          onDeleteConfirm={onDeleteTransConfirm}
          type="transaction"
        />
      </Modal>
      <Modal
        show={isDeleteHoldOpen}
        handleClose={() => toggleDeleteHolding(!isDeleteHoldOpen)}
      >
        <DeleteForm
          transactionId={
            deleteTransaction ? deleteTransaction.trans_buy_id : ""
          }
          handleClose={() => toggleDeleteHolding(!isDeleteHoldOpen)}
          onDeleteConfirm={onDeleteHoldConfirm}
          type="holding"
        />
      </Modal>

      <Modal
        show={isPublicSaveTransOpen}
        handleClose={() => togglePublicSaveTransOpen(!isPublicSaveTransOpen)}
      >
        <SignupPromptForm
          handleClose={() => togglePublicSaveTransOpen(!isPublicSaveTransOpen)}
          onSignupConfirm={onSignupConfirm}
        />
      </Modal>

      <Modal
        show={isAddSymbolOpen}
        handleClose={() => toggleAddSymbol(!isAddSymbolOpen)}
      >
        <AddSymbol
          user_id={user_id}
          port_id={port_id}
          port_name={port_name}
          holdings={holdings}
          setHoldings={setHoldings}
          handleClose={() => toggleAddSymbol(!isAddSymbolOpen)}
        />
      </Modal>
      <Paper className={classes.root}>
        <div className={classes.drawerHeader} />

        <TableContainer className={classes.container}>
          <div
            style={{
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: 900,
            }}
          >
            {port_name}
          </div>
          <Table stickyHeader area-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <IconButton
                    aria-label="add-holding"
                    size="small"
                    onClick={() => toggleAddSymbol(!isAddSymbolOpen)}
                  >
                    <AddIcon />
                  </IconButton>
                  {holdings.length > 0 ? (
                    <IconButton
                      aria-label="refresh-all-holding"
                      size="small"
                      onClick={() => getQuotes()}
                    >
                      <SyncIcon
                        className={updatingAllPrice ? "refresh-start" : ""}
                      />
                    </IconButton>
                  ) : null}
                </StyledTableCell>

                <StyledTableCell align="left">Symbol</StyledTableCell>
                <StyledTableCell align="right">Shares</StyledTableCell>
                <StyledTableCell align="right">Market Price</StyledTableCell>
                <StyledTableCell align="right">
                  Avg Cost Per Share
                </StyledTableCell>
                <StyledTableCell align="right">Book Value</StyledTableCell>
                <StyledTableCell align="right">Market Value</StyledTableCell>
                <StyledTableCell align="right">
                  Total Gain/(Loss)
                </StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioHoldings.map((row) => (
                <TransactionsRows
                  key={row.symbol}
                  user_id={user_id}
                  port_id={port_id}
                  holding={row}
                  refreshPrice={refreshPrice}
                  refreshSpinner={refreshSpinner}
                  prices={prices}
                  setHoldings={setHoldings}
                  handleDeleteTransaction={handleDeleteTransaction}
                  deleteTransaction={deleteTransaction}
                  handleDeleteHolding={handleDeleteHolding}
                  brokers={brokers}
                  togglePublicSaveTransOpen={togglePublicSaveTransOpen}
                  updateTransaction={updateTransaction}
                  buyTransactions={buyTransactions}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default HoldingsTable;