const router = require("express").Router();
const db = require("../db");
const sql_transactions = require("../db/qry_transactions").sql_transactions;
const sql_update_transaction =
  require("../db/qry_transactions").sql_update_transaction;
const sql_post_transaction =
  require("../db/qry_transactions").sql_post_transaction;
const sql_holding = require("../db/qry_holdings").sql_holding;
const sql_buy_transactions_by_port =
  require("../db/qry_transactions").sql_buy_transactions_by_port;
const sql_all_buy_transactions =
  require("../db/qry_transactions").sql_all_buy_transactions;

const {
  getMarketPrices,
  getPortfolios,
  getHoldings,
} = require("../common/utils");

router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const qryResult = await db.query(`${sql_all_buy_transactions}`, [user_id]);

    const buyTrans = qryResult.rows;

    if (buyTrans.length > 0) {
      const portSymbols = [...new Set(buyTrans.map((trans) => trans.symbol))];
      const portSymbolsNoNulls = portSymbols.filter((port) => port);

      getMarketPrices(portSymbolsNoNulls)
        .then((quotes) => {
          // console.log("quotes: ", quotes);

          const buyTransactions = buyTrans.map((trans) => ({
            ...trans,
            shares: Number(trans.shares),
            purchase_price: Number(trans.purchase_price),
            book_value: Number(trans.book_value),
            market_value:
              trans.shares *
              (quotes[trans.symbol] ? quotes[trans.symbol].price : ""),
            prev_day_mv:
              trans.shares *
              (quotes[trans.symbol]
                ? quotes[trans.symbol].marketPreviousClose
                : ""),
            ugl_day:
              trans.shares *
              (quotes[trans.symbol] ? quotes[trans.symbol].marketChange : ""),

            gain_loss:
              trans.shares *
                (quotes[trans.symbol] ? quotes[trans.symbol].price : "") -
              trans.shares * trans.purchase_price,

            current_price: quotes[trans.symbol]
              ? quotes[trans.symbol].price
              : "",
            marketChange: quotes[trans.symbol]
              ? quotes[trans.symbol].marketChange
              : "",
            marketPreviousClose: quotes[trans.symbol]
              ? quotes[trans.symbol].marketPreviousClose
              : "",
          }));

          res.status(200).json({
            buyTransactions,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      res.status(200).json({
        buyTransactions: [],
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/portfolio/:port_id", async (req, res) => {
  const port_id = req.params.port_id;

  try {
    const qryResult = await db.query(`${sql_buy_transactions_by_port}`, [
      port_id,
    ]);

    const buyTrans = qryResult.rows;

    if (buyTrans.length > 0) {
      const portSymbols = [...new Set(buyTrans.map((trans) => trans.symbol))];

      getMarketPrices(portSymbols)
        .then((quotes) => {
          const buyTransactions = buyTrans.map((trans) => ({
            ...trans,
            market_value: trans.shares * quotes[trans.symbol],
            gain_loss:
              trans.shares * quotes[trans.symbol] -
              trans.shares * trans.purchase_price,
            current_price: quotes[trans.symbol],
          }));

          res.status(200).json({
            buyTransactions,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      res.status(200).json({
        buyTransactions: [],
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  console.log(
    "transactions: put: req.params.id: ",
    req.params.id,
    "req.body: ",
    req.body
  );

  const trans_id = req.params.id;
  const symbol = req.body.symbol;
  const trade_date = req.body.trade_date;
  const purchase_price = req.body.purchase_price;
  const shares = req.body.shares;
  const broker_id = req.body.broker_id;
  const broker_name = req.body.broker_name;
  const comment = req.body.comment;
  const port_id = req.body.port_id;
  const port_name = req.body.port_name;

  try {
    const qryResult = await db.query(`${sql_update_transaction}`, [
      trans_id,
      symbol,
      shares,
      trade_date,
      purchase_price,
      comment,
      port_id,
      broker_id,
    ]);

    const buyTrans = qryResult.rows;

    getMarketPrices([symbol]).then((quotes) => {
      const buyTransaction = buyTrans.map((trans) => ({
        ...trans,
        port_name,
        broker_name,
        book_value: trans.shares * trans.purchase_price,
        market_value:
          trans.shares *
          (quotes[trans.symbol] ? quotes[trans.symbol].price : ""),
        prev_day_mv:
          trans.shares *
          (quotes[trans.symbol]
            ? quotes[trans.symbol].marketPreviousClose
            : ""),
        ugl_day:
          trans.shares *
          (quotes[trans.symbol] ? quotes[trans.symbol].marketChange : ""),

        gain_loss:
          trans.shares *
            (quotes[trans.symbol] ? quotes[trans.symbol].price : "") -
          trans.shares * trans.purchase_price,

        current_price: quotes[trans.symbol] ? quotes[trans.symbol].price : "",
        marketChange: quotes[trans.symbol]
          ? quotes[trans.symbol].marketChange
          : "",
        marketPreviousClose: quotes[trans.symbol]
          ? quotes[trans.symbol].marketPreviousClose
          : "",

        // book_value: trans.shares * trans.purchase_price,
        // market_value: trans.shares * quotes[trans.symbol],
        // gain_loss:
        //   trans.shares * quotes[trans.symbol] -
        //   trans.shares * trans.purchase_price,
        // current_price: quotes[trans.symbol],
        // newTransaction: false,
      }));

      res.status(200).json({
        status: "success",
        buyTransaction,
      });
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  const symbol = req.body.symbol;
  const trade_date = req.body.trade_date;
  const purchase_price = req.body.purchase_price;
  const shares = req.body.shares;
  const comment = req.body.comment;
  const port_id = req.body.port_id;
  const port_name = req.body.port_name;
  const broker_id = req.body.broker_id;
  const broker_name = req.body.broker_name;
  const user_id = req.body.user_id;

  try {
    const qryResult = await db.query(`${sql_post_transaction}`, [
      symbol,
      shares,
      trade_date,
      purchase_price,
      comment,
      port_id,
      broker_id,
      user_id,
    ]);

    const buyTrans = qryResult.rows;

    getMarketPrices([symbol]).then((quotes) => {
      const trans = buyTrans[0];
      const buyTransaction = {
        ...trans,
        port_name,
        broker_name,
        shares: Number(trans.shares),
        purchase_price: Number(trans.purchase_price),
        book_value: trans.shares * trans.purchase_price,
        market_value:
          trans.shares *
          (quotes[trans.symbol] ? quotes[trans.symbol].price : ""),
        prev_day_mv:
          trans.shares *
          (quotes[trans.symbol]
            ? quotes[trans.symbol].marketPreviousClose
            : ""),
        ugl_day:
          trans.shares *
          (quotes[trans.symbol] ? quotes[trans.symbol].marketChange : ""),

        gain_loss:
          trans.shares *
            (quotes[trans.symbol] ? quotes[trans.symbol].price : "") -
          trans.shares * trans.purchase_price,

        current_price: quotes[trans.symbol] ? quotes[trans.symbol].price : "",
        marketChange: quotes[trans.symbol]
          ? quotes[trans.symbol].marketChange
          : "",
        marketPreviousClose: quotes[trans.symbol]
          ? quotes[trans.symbol].marketPreviousClose
          : "",
        newTransaction: true,
      };

      // const buyTransactions = portTransactions.filter((trans) => trans.symbol);

      // const portfolios = getPortfolios(portTransactions, user_id);
      // const holdings = getHoldings(buyTransactions);
      // console.log("buyTrans: ", buyTrans, "buyTransaction: ", buyTransaction);

      res.status(200).json({
        status: "success",
        // portfolios,
        // holdings,
        buyTransaction,
      });
    });
  } catch (err) {
    console.log(err);
    const error = { message: "Could not update transaction for this symbol" };
    res.status(400).send(error);
  }
});

router.delete("/:port_id/:symbol", async (req, res) => {
  console.log("transactions: delete: req.params.id", req.params);
  const port_id = req.params.port_id;
  const symbol = req.params.symbol;

  try {
    const qryResult = await db.query(
      "DELETE FROM transaction_buy WHERE port_id=$1 and symbol=$2",
      [port_id, symbol]
    );

    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:transId", async (req, res) => {
  console.log("transactions: delete: req.params.id", req.params);
  const trans_id = req.params.transId;

  try {
    const qryResult = await db.query(
      "DELETE FROM transaction_buy WHERE trans_buy_id=$1",
      [trans_id]
    );

    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
