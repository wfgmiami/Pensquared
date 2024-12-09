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

  useEffect(() => {}, []);

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

  // const handleSaveApi = async (event) => {
  //   try {
  //     // pass symbol in an array as it uses the API that handles multiple symbols

  //     const addSymbolGetPrice = await getQuotesApi([symbol.symbol_name]);
  //     const quote = addSymbolGetPrice.quotes;
  //     const price = quote[symbol.symbol_name];
  //     if (price) {
  //       const quoteData = {
  //         symbol: symbol.symbol_name,
  //         price,
  //       };

  //       if (user_id) {
  //         try {
  //           const addSymbolPriceTableResponse = await addSymbolPriceTableApi(
  //             quoteData
  //           );
  //           const addedHolding = {
  //             trade_date: new Date(),
  //             symbol: symbol.symbol_name,
  //             port_id,
  //             user_id,
  //             newTransaction: true,
  //           };

  //           const addSymbolResponse = await updateTransactionApi(addedHolding);
  //           const addedSymbol = addSymbolResponse.holding;

  //           setHoldings((prev) => [addedSymbol, ...prev]);

  //           resetOnClose();
  //         } catch (error) {
  //           console.log(error);
  //           setErrors({ onSave: "Could not add price for this symbol" });
  //         }
  //       } else {
  //         const addedSymbolPublic = {
  //           avg_cost_per_share: 0,
  //           book_value: 0,
  //           current_price: quote[symbol.symbol_name],
  //           market_value: 0,
  //           port_id,
  //           shares: 0,
  //           symbol: symbol.symbol_name,
  //         };

  //         dispatch(createPublicHolding(addedSymbolPublic));
  //         setHoldings((prev) => [addedSymbolPublic, ...prev]);
  //         resetOnClose();
  //       }
  //     } else {
  //       setErrors({ onSave: "No price was retrieved for this symbol" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setErrors({ onSave: "Error getting a price for this symbol" });
  //   }
  // };

  // when accessed by public user, it adds the new symbol to the redux state  holdings.publicHoldings
  const handleSave = (event) => {
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
      const publicHolding = {
        avg_cost_per_share: 0,
        book_value: 0,
        current_price: 0,
        market_value: 0,
        port_id,
        port_name,
        shares: 0,
        symbol: symbol.symbol_name,
        ugl: 0,
      };

      dispatch(createPublicHolding(publicHolding));
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
