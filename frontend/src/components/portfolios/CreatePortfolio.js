import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import {
  loadPortfolios,
  createPortfolio,
  createPortfolioPublic,
} from "../../redux/actions/portfolioActions";
import CreatePortfolioForm from "./CreatePortfolioForm";
import { portfolioIsValid } from "../common/FormIsValid";
import { loadBuyTransactions } from "../../redux/actions/transactionActions";

function CreatePortfolio({
  portfolios,
  createPortfolio,
  createPortfolioPublic,
  portfolioCurrency,
  portfolioAssetClass,
  handleClose,
  userInfo,
  ...props
}) {
  const [portfolio, setNewPortfolio] = useState({ ...props.portfolio });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }
  const portfoliosList = useSelector(
    (state) => state.portfolios.portfoliosList
  );

  // console.log(
  //   "CreatePortfolio: portfolio: ",
  //   portfolio,
  //   " userInfo: ",
  //   userInfo
  // );

  function handleChange(event) {
    setSaving(false);
    setErrors({});
    const { name, value } = event.target;

    setNewPortfolio((prevPortfoliio) => ({
      ...prevPortfoliio,
      [name]: value,
      user_id,
    }));
  }

  function resetOnClose() {
    setNewPortfolio({ ...props.portfolio });
    setErrors({});
    setSaving(false);
    handleClose();
  }

  // adds the new Portfolio to the redux state portfolios.portfoliosList
  function handleSave(event) {
    event.preventDefault();
    if (!portfolioIsValid(portfolio, setErrors)) return;
    setSaving(true);

    if (user_id) {
      createPortfolio(portfolio)
        .then(() => {
          // dispatch(loadBuyTransactions(user_id));
          // setPortfolios((prev) => [...prev, portfolio]);
          setSaving(false);
          resetOnClose();
        })
        .catch((error) => {
          setSaving(false);
          setErrors({ onSave: error.message });
          setSaving(false);
        });
    } else {
      const checkSameName = portfolios.filter(
        (port) => port.port_name === portfolio.port_name
      );
      // console.log(
      //   "checkSameName: ",
      //   checkSameName,
      //   "portfolio: ",
      //   portfolio,
      //   "portfolios: ",
      //   portfolios
      // );

      if (checkSameName.length > 0) {
        setErrors({ onSave: "Portfolio name already exists!" });
        setSaving(false);
        return;
      }

      let publicPortfolio = {};

      if (portfolios.length > 0) {
        const maxId = Math.max.apply(
          Math,
          portfolios.map((port) => port.port_id)
        );
        publicPortfolio = {
          ...portfolio,
          port_id: maxId + 1,
          existing: false,
        };
      } else {
        publicPortfolio = { ...portfolio, port_id: 1, existing: false };
      }

      createPortfolioPublic(publicPortfolio);
      resetOnClose();
    }
  }

  return (
    <CreatePortfolioForm
      portfolio={portfolio}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      handleClose={resetOnClose}
      saving={saving}
      // portfolioAssetClass={portfolioAssetClass}
      // portfolioCurrency={portfolioCurrency}
    />
  );
}

CreatePortfolio.propTypes = {
  createPortfolio: PropTypes.func.isRequired,
  createPortfolioPublic: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  loadPortfolios: PropTypes.func.isRequired,
  portfolio: PropTypes.object.isRequired,
  portfolios: PropTypes.array.isRequired,
  portfolioCurrency: PropTypes.array.isRequired,
  portfolioAssetClass: PropTypes.array.isRequired,
  userInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
};

function mapStateToProps(state) {
  return {
    portfolios: state.portfolios.portfoliosList,
    portfolio: state.portfolios.newPortfolio,
    portfolioCurrency: state.portfolios.currency,
    portfolioAssetClass: state.portfolios.asset_class,
    userInfo: state.user.userInfo,
  };
}

const mapDispatchToProps = {
  loadPortfolios,
  createPortfolio,
  createPortfolioPublic,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreatePortfolio)
);
