const { spawn } = require("child_process");
const router = require("express").Router();
const path = require("path");
// const sql_price_update = require("../db/qry_priceUpdate").sql_price_update;
const db = require("../db");
const runPyQuotes = (symbols) =>
  new Promise((success, fail) => {
    const py_filePath = path.join(
      __dirname,
      "..",
      "/pyMarketData/marketData.py"
    );
    const holdings = symbols.join();
    const pyProg = spawn("python", [`${py_filePath}`, holdings]);
    pyProg.stdout.on("data", (data) => success(data.toString("utf-8")));
    pyProg.stderr.on("data", (data) => fail(data.toString("utf-8")));
  });

const checkIfPriceExist = async (symbol) => {
  let priceArray = [];

  try {
    const qryResult = await db.query(
      "select current_price from currentprice where symbol=$1",
      [symbol]
    );
    priceArray = qryResult.rows;
  } catch (error) {
    console.log(error);
  }
  return priceArray;
};
// gets the market prices for the portfolio holdings
router.post("/quotes", (req, res) => {
  console.log("post /quotes: req.body", req.body);
  const symbols = req.body;
  runPyQuotes(symbols)
    .then((quotes) => {
      console.log("quotes: ", quotes);

      res.status(200).json({
        status: "success",
        quotes,
      });
    })
    .catch((error) => console.log(error));
});

// insert a new symbol along with its current price
router.post("/symbol", async (req, res) => {
  console.log("marketData: post: req.body", req.body);
  const symbol = req.body.symbol;
  const current_price = req.body.price;
  const updateDate = Date.now() / 1000.0;
  // let priceExist = false;

  // do not add already existing pricing record for a symbol

  // let priceArray = [];

  try {
    const qryResult = await db.query(
      "select current_price from currentprice where symbol=$1",
      [symbol]
    );
    const priceArray = qryResult.rows;
    console.log("marketData:priceArray", priceArray);
    if (priceArray.length > 0) {
      try {
        const currentPrice = await db.query(
          "update currentprice set current_price=$2, current_price_date=to_timestamp($3) where symbol=$1",
          [symbol, current_price, updateDate]
        );

        res.status(200).json({
          status: "success",
          results: currentPrice.rows.length,

          symbolCurrentPrice: currentPrice.rows,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const currentPrice = await db.query(
          "insert into currentprice (symbol, current_price, current_price_date) values($1, $2, to_timestamp($3))",
          [symbol, current_price, updateDate]
        );

        res.status(200).json({
          status: "success",
          results: currentPrice.rows.length,

          symbolCurrentPrice: currentPrice.rows,
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    console.log(error);
  }
  // checkIfPriceExist(symbol)
  //   .then((priceArray) => {
  //     console.log("priceArray.length > 0", priceArray.length > 0);
  //     priceExist = priceArray.length > 0;
  //   })
  //   .catch((error) => console.log(error));

  // console.log("priceExist: ", priceExist);
});

// updates the currentprice table with the latest market prices
router.put("/prices", async (req, res) => {
  console.log("market data prices: put: req.body: ", req.body);
  const sql_price_update = constructQuery(req.body);

  console.log("put: sql_price_update:", sql_price_update);
  try {
    const qryResult = await db.query(`${sql_price_update}`);

    res.status(200).json({
      status: "success",
      updatedPrices: qryResult.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

const constructQuery = (quotes) => {
  const updateDate = Date.now() / 1000.0;

  return `update currentprice as cp set
  current_price = s.current_price,
  current_price_date = s.current_price_date
  from ( values
    ${Object.keys(quotes)
      .map(
        (symbol) =>
          `('${symbol}',${quotes[symbol]}, to_timestamp(${updateDate}))`
      )
      .join(",")}

   ) as s (symbol, current_price, current_price_date)
  where cp.symbol = s.symbol
  returning *`;
};

module.exports = router;
