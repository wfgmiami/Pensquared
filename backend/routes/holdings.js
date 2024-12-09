const router = require("express").Router();
const db = require("../db");
const sql_holdings = require("../db/qry_holdings").sql_holdings;
const sql_port_all_buy_transactions =
  require("../db/qry_transactions").sql_port_all_buy_transactions;
const {
  getMarketPrices,
  getPortfolios,
  getHoldings,
} = require("../common/utils");

// returns portfolio holdings - holdingApi.js /api/holdings/1
router.get("/:portId", async (req, res) => {
  console.log("holdings: get: req.params: ", req.params);
  try {
    const holdings = await db.query(`${sql_holdings}`, [req.params.portId]);

    res.status(200).json({
      status: "success",
      results: holdings.rows.length,
      holdings: holdings.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

// returns portfolio holdings - holdingApi.js /api/holdings/1/AAPL
router.delete("/:portId/:symbol/:userId", async (req, res) => {
  console.log("holdings: delete holding: req.params.id", req.params);
  const symbol = req.params.symbol;
  const port_id = req.params.portId;
  const user_id = req.params.userId;
  try {
    const qryResult = await db.query(
      "DELETE FROM transaction_buy WHERE symbol=$1 and port_id=$2",
      [symbol, port_id]
    );
    try {
      const qryResult = await db.query(`${sql_port_all_buy_transactions}`, [
        port_id,
      ]);

      const buyTrans = qryResult.rows;

      if (buyTrans.length > 0) {
        const portSymbols = [...new Set(buyTrans.map((trans) => trans.symbol))];
        const portSymbolsNoNulls = portSymbols.filter((symbol) => symbol);
        console.log("portSymbolsNoNulls: ", portSymbolsNoNulls);

        if (portSymbolsNoNulls.length > 0) {
          getMarketPrices(portSymbolsNoNulls)
            .then((quotes) => {
              console.log("quotes: ", quotes);
              const portTransactions = buyTrans.map((trans) => ({
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
                  (quotes[trans.symbol]
                    ? quotes[trans.symbol].marketChange
                    : ""),

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
              const portfolios = getPortfolios(portTransactions, user_id);
              console.log("portfolios: ", portfolios);

              res.status(200).json({
                portfolios,
              });
            })
            .catch((error) => {
              throw new Error(error);
            });
        } else {
          const { port_id, port_name, currency, asset_class } = buyTrans[0];

          const portfolios = [
            {
              port_id,
              port_name,
              currency,
              asset_class,
              symbols: 0,
              user_id,
              bv: 0,
              mv: 0,
              prev_day_mv: 0,
              ugl_day: 0,
              ugl_day_percent: 0,
              ugl: 0,
              ugl_percent: 0,
            },
          ];
          console.log("portfolios2: ", portfolios);

          res.status(200).json({
            portfolios,
          });
        }
      } else {
        res.status(200).json({
          portfolios: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
    // res.status(204).json({
    //   status: "success",
    // });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
