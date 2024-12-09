import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  deletePortfolio,
  deletePortfolioPublic,
} from "../../redux/actions/portfolioActions";
import { removePublicHolding } from "../../redux/actions/holdingActions";
import { loadBuyTransactions } from "../../redux/actions/transactionActions";
import DeletePortfolioForm from "./DeletePortfolioForm";

function DeletePortfolio({ portfolioId, portfolios, handleClose }) {
  const [portfolio, setPortfolio] = useState({});
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  // const portfolios = useSelector((state) => state.portfolios.portfoliosList);
  const userInfo = useSelector((state) => state.user.userInfo);
  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }

  useEffect(() => {
    if (portfolioId) {
      const portfolio = portfolios.find((port) => port.port_id === portfolioId);
      setPortfolio(portfolio);
    }
  }, [portfolioId]);

  function resetOnClose() {
    const portfolio = portfolios.find((port) => port.port_id === portfolioId);
    setPortfolio(portfolio);
    setErrors({});
    handleClose();
  }

  function handleDelete(event) {
    event.preventDefault();
    const port_id = portfolio.port_id;
    if (user_id) {
      dispatch(deletePortfolio(port_id))
        .then(() => {
          handleClose();
        })
        .catch((error) => {
          setErrors({ onSave: error.message });
          resetOnClose();
        });
    } else {
      dispatch(deletePortfolioPublic(port_id));
      // to delete all public holdings. if not, next public portfolio will show old holdings
      dispatch(removePublicHolding({ port_id }));
      resetOnClose();
    }
  }

  return (
    <DeletePortfolioForm
      port_name={portfolio.port_name}
      errors={errors}
      onDelete={handleDelete}
      handleClose={resetOnClose}
    />
  );
}

DeletePortfolio.propTypes = {
  handleClose: PropTypes.func.isRequired,
  portfolioId: PropTypes.number,
};

export default DeletePortfolio;
