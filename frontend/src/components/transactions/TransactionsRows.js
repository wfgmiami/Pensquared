import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
// import SyncIcon from "@material-ui/icons/Sync";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AddIcon from "@material-ui/icons/Add";
import {
  loadTransactions as loadTransactionsApi,
  updateTransaction as updateTransactionApi,
} from "../../api/transactionApi";
import { updateReduxBroker } from "../../redux/actions/brokerActions";
// import { updateBuyTransaction } from "../../redux/actions/transactionActions";
import DatePicker from "../common/DatePicker";
import DateConverter from "../common/DateCoverter";
import SelectInput from "../common/SelectInput";
import {
  strRemoveComma,
  numTwoDecimal,
  strTwoDecimalComma,
} from "../common/NumberFormat";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    maxHeight: 440,
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
  tableRow: {
    backgroundColor: "#eceeef",
  },
}));

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const useRowStyles = makeStyles({
  "& > *": {
    borderBottom: "unset",
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.white,
  },
}))(TableCell);

const CustomTableCell = ({ row, name, onChange, brokersSelect }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  let tdField = false;
  let brokerField = false;
  let tradeDate = "";
  let transValue = row[name];
  let editable = true;
  let valueAlign = "left";
  let inputType = "number";

  if (name === "trade_date") {
    tdField = true;
    tradeDate = DateConverter(row[name], "mm/dd/yy");
  }

  if (
    name === "book_value" ||
    name === "market_value" ||
    name === "gain_loss"
  ) {
    editable = false;
    valueAlign = "right";
  }

  if (name === "broker_name" || name === "comment") {
    inputType = "text";
    if (name === "broker_name") {
      brokerField = true;
    }
  }

  const onSelectDate = (selectedDate) => {
    const e = { target: { name: "trade_date", value: selectedDate } };
    onChange(e, row);
  };

  switch (name) {
    case "shares":
    case "purchase_price":
      valueAlign = "right";

      if (!isEditMode) transValue = strTwoDecimalComma(transValue);

      break;
    case "book_value":
    case "market_value":
    case "gain_loss":
      transValue = strTwoDecimalComma(transValue);
      //   valueAlign = "right";
      break;
    default:
      transValue;
  }

  return (
    <TableCell align={valueAlign} className={classes.tableCell}>
      {isEditMode && !tdField && !brokerField && editable ? (
        <Input
          // if '|| ""' is not there, then there is an error for undefined input
          type={inputType}
          value={transValue || ""}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : isEditMode && tdField ? (
        <DatePicker
          onSelectDate={(selectedDate) => onSelectDate(selectedDate)}
          tradeDate={tradeDate}
        />
      ) : tdField ? (
        tradeDate
      ) : brokerField && isEditMode ? (
        <SelectInput
          name="broker_name"
          label=""
          value={transValue || ""}
          // defaultOption={brokersSelect.length > 0 ? "" : "Select Broker"}
          options={brokersSelect.map((broker) => ({
            value: broker,
            text: broker,
          }))}
          onChange={(e) => onChange(e, row)}
        />
      ) : (
        transValue
      )}
    </TableCell>
  );
};

function TransactionsTable(props) {
  const {
    user_id,
    port_id,
    holding,
    refreshPrice,
    refreshSpinner,
    prices,
    handleDeleteTransaction,
    deleteTransaction,
    handleDeleteHolding,
    brokers,
    togglePublicSaveTransOpen,
    updateTransaction,
    // buyTransactions,
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const rowClasses = useRowStyles();

  const [rows, setRows] = useState([]);
  const [previous, setPrevious] = useState({});
  const [open, setOpen] = useState(false);
  const [newUpdTrans, setNewUpdTrans] = useState(() => ({
    trans_buy_id: "",
    newTransaction: false,
  }));

  console.log("TransactionTable: rows: ", rows);
  let brokersSelect = [];
  const updatingPrice = refreshSpinner === holding.symbol;

  const newTransaction = useSelector(
    (state) => state.transactions.newTransaction
  );

  const buyTransactions = useSelector(
    (state) => state.transactions.buyTransactions
  );

  if (brokers.length > 0) {
    brokersSelect = brokers.map((brk) => brk.broker_name);
  }

  useEffect(() => {
    // console.log("useEffect prices:", prices);
    if (Object.keys(prices).length > 0) {
      const symbols = Object.keys(prices);

      setRows((prev) => {
        return prev.map((trans) => {
          // console.log("trans: ", trans, "symbols", symbols);
          if (symbols.includes(trans.symbol)) {
            const updatedMarketValue =
              Number(trans.shares) * Number(prices[trans.symbol]);
            const updatedUGL = updatedMarketValue - Number(trans.book_value);
            return {
              ...trans,
              market_value: updatedMarketValue,
              gain_loss: updatedUGL,
            };
          }
          return trans;
        });
      });
    }
  }, [prices]);

  useEffect(() => {
    // console.log(
    //   "useEffect deleteTransaction: ",
    //   deleteTransaction,
    //   " rows: ",
    //   rows
    // );
    if (deleteTransaction.confirmDelete) {
      const { trans_buy_id, symbol } = deleteTransaction;

      setRows((prev) =>
        prev.filter((trans) => {
          if (trans.symbol === symbol) {
            return trans.trans_buy_id !== trans_buy_id;
          }
          return trans;
        })
      );
    }
  }, [deleteTransaction]);

  useEffect(() => {
    // console.log(
    //   "useEffect buyTransactions: ",
    //   buyTransactions,
    //   "newUpdTrans: ",
    //   newUpdTrans
    // );

    if (newUpdTrans.newTransaction || newUpdTrans.trans_buy_id) {
      const transProp = newUpdTrans.newTransaction
        ? "newTransaction"
        : "trans_buy_id";

      const actionTransaction = buyTransactions.filter(
        (trans) => trans[`${transProp}`] === newUpdTrans[`${transProp}`]
      );
      const updatedTransaction = actionTransaction[0];

      setRows((state) => {
        return state.map((row) => {
          if (row[`${transProp}`] === newUpdTrans[`${transProp}`]) {
            return {
              ...row,
              market_value: numTwoDecimal(updatedTransaction.market_value),
              gain_loss: numTwoDecimal(updatedTransaction.gain_loss),
              // shares: numTwoDecimal(updatedTransaction.shares),
              // purchase_price: numTwoDecimal(updatedTransaction.purchase_price),
              isEditMode: !row.isEditMode,
              newTransaction: false,
            };
          }
          return row;
        });
      });

      setNewUpdTrans({ trans_buy_id: "", newTransaction: false });
    } else {
      const { symbol } = holding;

      if (user_id) {
        if (open === false) {
          const portTransactions = buyTransactions.filter(
            (trans) => trans.port_id === parseInt(port_id)
          );

          const enhancedTrans = portTransactions
            .filter((trans) => trans.symbol === symbol)
            .map((curr) => {
              if (curr.symbol === symbol) {
                return {
                  ...curr,
                  isEditMode: false,
                  newTransaction: false,
                  // shares: strTwoDecimalComma(curr.shares),
                  // purchase_price: strTwoDecimalComma(curr.purchase_price),
                  // book_value: strTwoDecimalComma(curr.book_value),
                  // market_value: strTwoDecimalComma(curr.market_value),
                  // gain_loss: strTwoDecimalComma(curr.gain_loss),
                };
              }
            });

          setRows(enhancedTrans);
        }
      } else {
        onAddTransaction();
      }
    }
  }, [buyTransactions]);

  const onToggleEditMode = (row) => {
    const { trans_buy_id } = row;

    setRows((state) => {
      return state.map((row) => {
        if (row.trans_buy_id === trans_buy_id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onDoneEditMode = (row) => {
    if (!user_id) {
      togglePublicSaveTransOpen(true);
    } else {
      const { trans_buy_id, newTransaction } = row;
      setNewUpdTrans({ trans_buy_id, newTransaction });
      updateTransaction(row);

      if (previous[row.trans_buy_id]) {
        setPrevious((state) => ({ ...state, [row.trans_buy_id]: row }));
      }
    }
  };

  const onChange = (e, row) => {
    if (!previous[row.trans_buy_id]) {
      setPrevious((state) => ({ ...state, [row.trans_buy_id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const current_price = holding.current_price;

    let book_value, market_value, gain_loss, broker_id;

    const { trans_buy_id } = row;

    const newRows = rows.map((row) => {
      if (row.trans_buy_id === trans_buy_id) {
        if (name === "shares") {
          book_value = value * row["purchase_price"];
          market_value = value * current_price;
          // gain_loss = strTwoDecimalComma(market_value - book_value);
          gain_loss = market_value - book_value;
        } else if (name === "purchase_price") {
          book_value = value * row["shares"];
          // book_value =
          //   value *
          //   (typeof row["shares"] === "number"
          //     ? row["shares"]
          //     : strRemoveComma(row["shares"]));

          // market_value =
          //   typeof row["market_value"] === "number"
          //     ? row["market_value"]
          //     : strRemoveComma(row["market_value"]);
          market_value = row["market_value"];
          // gain_loss = strTwoDecimalComma(market_value - book_value);
          gain_loss = market_value - book_value;
        } else if (name === "broker_name") {
          broker_id = null;
          if (value) {
            const broker = brokers.filter((brk) => brk.broker_name === value);
            broker_id = broker[0].broker_id;
          }
        }

        if (name === "shares" || name === "purchase_price") {
          // market_value = strTwoDecimalComma(market_value);
          // book_value = strTwoDecimalComma(book_value);

          return { ...row, [name]: value, book_value, market_value, gain_loss };
        } else if (name === "broker_name") {
          return { ...row, [name]: value, broker_id };
        } else {
          return { ...row, [name]: value };
        }
      }

      return row;
    });
    setRows(newRows);
  };

  const onRevert = (row) => {
    const { trans_buy_id } = row;

    const newRows = rows.map((row) => {
      if (row.trans_buy_id === trans_buy_id) {
        return previous[trans_buy_id] ? previous[trans_buy_id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious((state) => {
      delete state[trans_buy_id];
      return state;
    });
    onToggleEditMode(row);
  };

  // triggers when + is clicked on transaction row to add new transaction
  // triggers when a public user adds a new symbol
  const onAddTransaction = () => {
    // there should be at least one transaction with symbol, port id, broker_name(could be null) available

    const { port_id, port_name, symbol } = holding;
    let nextId = 0;

    if (rows.length > 0) {
      nextId = Math.max(...rows.map((trans) => trans.trans_buy_id));
    }

    setRows((prev) => [
      ...prev,
      {
        ...newTransaction,
        trans_buy_id: nextId + 1,
        symbol,
        port_id,
        port_name,
        user_id,
      },
    ]);
  };

  const refreshHolding = () => {
    refreshPrice(holding);
  };

  return (
    <React.Fragment>
      <TableRow className={`classes.borderBottom ${classes.tableRow}`}>
        <TableCell>
          <IconButton
            aria-label="expand-row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {/* <IconButton
            aria-label="refresh-holding"
            size="small"
            onClick={() => refreshHolding()}
          >
            <SyncIcon className={updatingPrice ? "refresh-start" : ""} />
          </IconButton> */}
        </TableCell>
        <TableCell component="th" scope="row">
          {holding.symbol}
        </TableCell>
        <TableCell align="right">
          {strTwoDecimalComma(holding.shares)}
        </TableCell>
        <TableCell align="right">
          {holding.current_price
            ? strTwoDecimalComma(holding.current_price)
            : "N/A"}
        </TableCell>
        <TableCell align="right">
          {strTwoDecimalComma(holding.avg_cost_per_share)}
        </TableCell>
        <TableCell align="right">
          {strTwoDecimalComma(holding.book_value)}
        </TableCell>
        <TableCell align="right">
          {strTwoDecimalComma(holding.market_value)}
        </TableCell>
        <TableCell align="right">{strTwoDecimalComma(holding.ugl)}</TableCell>
        <TableCell style={{ padding: 0, textAlign: "right" }}>
          <IconButton
            aria-label="delete-holding"
            size="small"
            onClick={() => handleDeleteHolding(holding)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <TableContainer className={classes.container}>
                <Table stickyHeader size="small" aria-label="transactions">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>
                        <IconButton
                          aria-label="add-transaction"
                          size="small"
                          onClick={onAddTransaction}
                        >
                          <AddIcon />
                        </IconButton>
                      </StyledTableCell>

                      <StyledTableCell>Trade Date</StyledTableCell>
                      <StyledTableCell align="right">Shares</StyledTableCell>
                      <StyledTableCell align="right">
                        Purchase Price
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Book Value
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Market Value
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Lot Gain/(Loss)
                      </StyledTableCell>
                      <StyledTableCell>Broker Account</StyledTableCell>
                      <StyledTableCell>Comment</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.trans_buy_id}>
                        <TableCell className={classes.selectTableCell}>
                          {row.isEditMode ? (
                            <>
                              <IconButton
                                aria-label="done"
                                onClick={() => onDoneEditMode(row)}
                              >
                                <DoneIcon />
                              </IconButton>
                              <IconButton
                                aria-label="revert"
                                onClick={() => onRevert(row)}
                              >
                                <RevertIcon />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                aria-label="edit"
                                onClick={() => onToggleEditMode(row)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleDeleteTransaction(row, rows.length)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>

                        <CustomTableCell
                          {...{ row, name: "trade_date", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "shares", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "purchase_price", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "book_value", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "market_value", onChange }}
                        />
                        <CustomTableCell
                          {...{ row, name: "gain_loss", onChange }}
                        />
                        <CustomTableCell
                          {...{
                            row,
                            name: "broker_name",
                            onChange,
                            brokersSelect,
                          }}
                        />
                        <CustomTableCell
                          {...{ row, name: "comment", onChange }}
                        />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default TransactionsTable;
