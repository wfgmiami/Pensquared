const portfolios = {
  portfolio: {},
  porfolioLoadedStatus: "",
  portfoliosList: [],
  porfoliosLoadedStatus: "",
  error: "",
  // TODO: Need to get from db - table: portfolio_attributes
  currency: [
    { currency_id: 1, currency_abbreviation: "USD" },
    { currency_id: 2, currency_abbreviation: "EUR" },
    { currency_id: 3, currency_abbreviation: "JPY" },
    { currency_id: 4, currency_abbreviation: "CNY" },
    { currency_id: 5, currency_abbreviation: "INR" },
  ],
  asset_class: [
    { asset_class_id: 1, asset_class_name: "Cash" },
    { asset_class_id: 2, asset_class_name: "Equity" },
    { asset_class_id: 3, asset_class_name: "Fixed Income" },
    { asset_class_id: 4, asset_class_name: "Equity ETF" },
    {
      asset_class_id: 5,
      asset_class_name: "Fixed Income ETF",
    },
    { asset_class_id: 6, asset_class_name: "Multi-Asset" },
  ],
  newPortfolio: {
    port_id: null,
    port_name: "",
    currency: "",
    asset_class: "",
  },
};

const brokers = {
  broker: {},
  brokersSelect: [],
  brokersList: [],
  brokersLoadedStatus: "",
  error: "",
  newBroker: {
    broker_id: null,
    broker_name: "",
    broker_acc_number: "",
    symbols: "",
    mv: "",
    ugl: "",
  },
};

const holdings = {
  holdingsList: [],
  holdingsLoadedStatus: "",
  error: "",
  publicHoldings: [],
};

const transactions = {
  buyTransactions: [],

  newTransaction: {
    trans_buy_id: 0,
    symbol: "",
    trade_date: new Date(),
    shares: 0,
    purchase_price: 0,
    book_value: 0,
    market_value: 0,
    gain_loss: 0,
    broker_name: "",
    broker_id: null,
    comment: "",
    port_id: null,
    port_name: "",
    isEditMode: false,
    newTransaction: true,
  },
};

export default {
  apiCallsInProgress: 0,
  contact: { isContactFormSent: false },
  portfolios,
  brokers,
  holdings,
  transactions,
};
