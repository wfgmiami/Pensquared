const router = require("express").Router();
const db = require("../db");

const sql_portfolios = require("../db/qry_portfolios").sql_port;
const sql_create_portfolio =
  require("../db/qry_portfolios").sql_create_portfolio;

const sql_all_buy_transactions =
  require("../db/qry_transactions").sql_all_buy_transactions;
const {
  getMarketPrices,
  getPortfolios,
  getHoldings,
} = require("../common/utils");

// /api/portfolios
router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const qryResult = await db.query(`${sql_all_buy_transactions}`, [user_id]);

    const buyTrans = qryResult.rows;

    if (buyTrans.length > 0) {
      const portSymbols = [...new Set(buyTrans.map((trans) => trans.symbol))];
      // const portSymbolsNoNulls = portSymbols.filter((port) => port);

      getMarketPrices(portSymbols)
        .then((quotes) => {
          // console.log("quotes: ", quotes);

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

          const buyTransactions = portTransactions.filter(
            (trans) => trans.symbol
          );

          const portfolios = getPortfolios(portTransactions, user_id);
          const holdings = getHoldings(buyTransactions);
          // console.log("buyTransactions: ", buyTransactions);

          res.status(200).json({
            portfolios,
            holdings,
            buyTransactions,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      res.status(200).json({
        portfolios: [],
        holdings: [],
        buyTransactions: [],
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.get("/:user_id", async (req, res, next) => {
// const user_id = req.params.user_id;
// try {
//   const portfolios = await db.query(`${sql_portfolios}`, [user_id]);
//   console.log("backend/routes/portfolios: get: portfolio: ", portfolios);

//   res.status(200).json({
//     status: "success",
//     results: portfolios.rows.length,
//     data: {
//       portfolios: portfolios.rows,
//     },
//   });
// } catch (err) {
//   console.log(err);
// }
// });

router.post("/", async (req, res) => {
  const port_name = req.body.port_name;
  const user_id = req.body.user_id;
  // console.log("portfolio: post req.body: ", req.body);

  try {
    if (port_name === "") throw Error("Portfolio name is required!");
    const qryResult = await db.query(
      "SELECT port_name FROM portfolio WHERE port_name = $1 AND user_id = $2",
      [port_name, user_id]
    );

    if (qryResult.rows.length !== 0) {
      const error = "Portfolio name already exists!";
      res.status(400).send(error);
    } else {
      try {
        const newPortfolio = await db.query(`${sql_create_portfolio}`, [
          port_name,
          user_id,
        ]);

        res.status(201).json({
          portfolio: newPortfolio.rows[0],
        });
      } catch (err) {
        res.status(400).send("Request could not process.");
      }
    }
  } catch (err) {
    res.status(400).send("Request could not process.");
  }
});

router.post("/public", async (req, res) => {
  const sql_public_portfolios = constructQuery(req.body);
  // console.log("portfolio: post public: req.body: ", sql_public_portfolios);
  try {
    const publicPortfolios = await db.query(`${sql_public_portfolios}`);
    // console.log("portfolio: post public: req.body: ", publicPortfolios);
    res.status(201).json({
      publicPortfolios: publicPortfolios.rows,
    });
  } catch (err) {
    res.status(400).send("Request could not process.");
  }
});

router.put("/:port_id", async (req, res) => {
  const port_id = req.params.port_id;
  const port_name = req.body.port_name;
  const user_id = req.body.user_id;
  console.log(
    "portfolio put: port_id: ",
    port_id,
    " port_name: ",
    port_name,
    " user_id: ",
    user_id
  );

  try {
    if (port_name === "") throw Error("Portfolio name is required!");
    const qryResult = await db.query(
      "SELECT port_name FROM portfolio WHERE port_name = $1 AND user_id = $2",
      [port_name, user_id]
    );

    if (qryResult.rows.length !== 0) {
      const error = "Portfolio name already exists!";
      res.status(400).send(error);
    } else {
      try {
        const updatedPortfolio = await db.query(
          "UPDATE portfolio SET port_name = $1 WHERE port_id = $2 returning *",
          [port_name, port_id]
        );

        res.status(200).json({
          portfolio: { ...req.body, ...updatedPortfolio.rows[0] },
        });
      } catch (err) {
        res.status(400).send("Request could not process.");
      }
    }
  } catch (err) {
    res.status(400).send("Request could not process.");
  }
});

router.delete("/:id", async (req, res) => {
  const port_id = req.params.id;
  // console.log("backend/routes/portfolios: port_id: ", port_id);

  try {
    const deletedPortfolio = await db.query(
      "delete from portfolio where port_id = $1",
      [port_id]
    );

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

const constructQuery = (portfolios) => {
  return `insert into portfolio(port_name, user_id) values
    ${portfolios
      .map((portfolio) => `('${portfolio.port_name}',${portfolio.user_id})`)
      .join(",")} returning *`;
};

module.exports = router;
