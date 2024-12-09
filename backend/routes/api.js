const router = require("express").Router();

router.use("/load", require("./intitialLoad"));

router.use("/portfolios", require("./portfolios"));

router.use("/holdings", require("./holdings"));

router.use("/transactions", require("./transactions"));

router.use("/marketdata", require("./marketData"));

router.use("/brokers", require("./brokers"));

router.use("/contactform", require("./contactform"));

router.use("/auth", require("./users"));

module.exports = router;
