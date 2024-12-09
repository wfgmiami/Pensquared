import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { updateTransaction as updateTransactionApi } from "../../api/transactionApi";
import {
  addSymbolPriceTable as addSymbolPriceTableApi,
  getQuotes as getQuotesApi,
} from "../../api/marketDataApi";

import { createPublicHolding } from "../../redux/actions/holdingActions";

import { updateBuyTransaction } from "../../redux/actions/transactionActions";

import { symbolIsValid } from "../common/FormIsValid";
import AddSymbolForm from "./AddSymbolForm";

function AddSymbol({
  user_id,
  port_id,
  port_name,
  holdings,
  setHoldings,
  handleClose,
}) {
  const [symbol, setSymbol] = useState({ symbol_name: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  // const portfolioHoldings = useSelector((state) => state.holdings.holdingsList);
  const newTransaction = useSelector(
    (state) => state.transactions.newTransaction
  );

  // useEffect(() => {}, []);

  function handleChange(event) {
    setSaving(false);
    setErrors({});
    const { name, value } = event.target;
    const symbol = value.toUpperCase();
    setSymbol((prev) => ({ ...prev, [name]: symbol }));
  }

  function resetOnClose() {
    setSymbol({ symbol_name: "" });
    setErrors({});
    setSaving(false);
    handleClose();
  }

  // when accessed by public user, it adds the new symbol to the redux state  holdings.publicHoldings
  const handleSave = async (event) => {
    event.preventDefault();

    if (!symbolIsValid(symbol, setErrors)) return;

    const holdExistArray = holdings.filter(
      (holding) =>
        holding.symbol === symbol.symbol_name &&
        Number(holding.port_id) === Number(port_id)
    );

    if (holdExistArray.length > 0) {
      setErrors({ symbol_name: "Symbol already exist in the portfolio" });
      return;
    }

    setSaving(true);

    if (user_id) {
      const newSymbol = {
        ...newTransaction,
        symbol: symbol.symbol_name,
        user_id,
        port_id,
        port_name,
      };
      dispatch(updateBuyTransaction(newSymbol));
    } else {
      try {
        const ticker = symbol.symbol_name;
        const data = await getQuotesApi([ticker]);
        const quote = data.quotes[ticker];

        const publicHolding = {
          avg_cost_per_share: 0,
          book_value: 0,
          current_price: quote,
          market_value: 0,
          port_id,
          port_name,
          shares: 0,
          symbol: ticker,
          ugl: 0,
        };

        dispatch(createPublicHolding(publicHolding));
      } catch (err) {
        console.log("error getting market price in AddSymbol: ", err);
      }
    }

    resetOnClose();
    // handleSaveApi(event);
  };

  return (
    <AddSymbolForm
      symbol={symbol}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      handleClose={resetOnClose}
      saving={saving}
    />
  );
}

AddSymbol.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default AddSymbol;
