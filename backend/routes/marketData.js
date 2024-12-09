const router = require("express").Router();
const https = require("https");
const db = require("../db");
const getUpdateCurrentpriceQuery = require("../common/utils");

const yUrl =
  "https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&fields=symbol,regularMarketPrice&symbols=";

const token = "c1anprn48v6v5v4h2sug";

const finnUrl =
  "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=" + token;

router.post("/tickers", (req, res) => {
  https.get(finnUrl, (response) => {
    let chunks = [];

    response
      .on("data", (data) => {
        chunks.push(data);
      })
      .on("end", () => {
        const data = Buffer.concat(chunks);
        const tickers = JSON.parse(data);

        res.status(200).json({
          status: "success",
          tickers,
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  });
});

router.post("/quotes", (req, res) => {
  console.log("post /quotes: req.body", req.body);
  const symbols = req.body;

  https.get(yUrl + symbols, (response) => {
    let chunks = [];
    let quotes = {};

    response
      .on("data", (data) => {
        chunks.push(data);
      })
      .on("end", () => {
        const data = Buffer.concat(chunks);
        const result = JSON.parse(data);
        const objArr = result.quoteResponse.result;

        quotes = objArr.reduce((finalObj, obj) => {
          const symbol = obj.symbol;
          const price = obj.regularMarketPrice;

          return { ...finalObj, [symbol]: price };
        }, {});

        for (let ticker in symbols) {
          const symbol = symbols[ticker];
          if (!(symbol in quotes)) quotes[symbol] = null;
        }

        console.log("quotes: ", quotes);

        res.status(200).json({
          status: "success",
          quotes,
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
        res.status(400).send(err);
      });
  });
});

// insert a new symbol along with its current price
router.post("/symbol", async (req, res) => {
  console.log("marketData: post/symbol: req.body", req.body);
  const symbol = req.body.symbol;
  const current_price = req.body.price;
  const updateDate = Date.now() / 1000.0;

  try {
    const qryResult = await db.query(
      "select current_price from currentprice where symbol=$1",
      [symbol]
    );
    const priceArray = qryResult.rows;
    // console.log("marketData: post/symbol: priceArray", priceArray);
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
        res.status(400).send(err);
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
        res.status(400).send(err);
      }
    }
  } catch (err) {
    console.log(err);
    const error = { message: "Could not update price for this symbol" };
    res.status(400).send(error);
  }
});

// updates the currentprice table with the latest market prices
router.put("/prices", async (req, res) => {
  console.log("market data prices: put: req.body: ", req.body);
  const sql_price_update = getUpdateCurrentpriceQuery(req.body);
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

// const constructQuery = (quotes) => {
//   const updateDate = Date.now() / 1000.0;

//   return `update currentprice as cp set
//   current_price = s.current_price,
//   current_price_date = s.current_price_date
//   from ( values
//     ${Object.keys(quotes)
//       .map(
//         (symbol) =>
//           `('${symbol}',${quotes[symbol]}, to_timestamp(${updateDate}))`
//       )
//       .join(",")}

//    ) as s (symbol, current_price, current_price_date)
//   where cp.symbol = s.symbol
//   returning *`;
// };

module.exports = router;
