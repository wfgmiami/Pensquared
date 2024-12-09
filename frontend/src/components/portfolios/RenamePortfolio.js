import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  createPortfolio,
  createPortfolioPublic,
} from "../../redux/actions/portfolioActions";
import RenamePortfolioForm from "./RenamePortfolioForm";
import { portfolioIsValid } from "../common/FormIsValid";
import { updateReduxPortfolio } from "../../redux/actions/portfolioActions";

function RenamePortfolio({
  portfolioId,
  portfolioName,
  portfolios,
  handleClose,
}) {
  const [portfolio, setPortfolio] = useState({ port_name: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();
  // const portfolios = useSelector((state) => state.portfolios.portfoliosList);
  const userInfo = useSelector((state) => state.user.userInfo);
  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }

  // console.log(
  //   "RenamePortfolio: user_id: ",
  //   user_id,
  //   "portfolioId: ",
  //   portfolioId
  // );

  useEffect(() => {
    if (portfolioId) {
      const portfolio = portfolios.find((port) => port.port_id === portfolioId);
      setPortfolio(portfolio);
    }
  }, [portfolioId]);

  useEffect(() => {
    if (portfolioId) {
      const portfolio = portfolios.find((port) => port.port_id === portfolioId);
      setPortfolio(portfolio);
    }
  }, [portfolioName]);

  function handleChange(event) {
    const { name, value } = event.target;
    setErrors({});

    setPortfolio((prevPort) => ({
      ...prevPort,
      [name]: value,
    }));
  }

  function resetOnClose() {
    const portfolio = portfolios.find((port) => port.port_id === portfolioId);
    setPortfolio(portfolio);
    setErrors({});
    setSaving(false);
    handleClose();
  }

  function handleSave(event) {
    event.preventDefault();

    const origPort = portfolios.find((port) => port.port_id === portfolioId);
    if (origPort.port_name === portfolio.port_name) {
      // resetOnClose();
      // return;
      setErrors({ onSave: "Portfolio name already exists!" });
      setSaving(false);
      return;
    } else {
      if (!portfolioIsValid(portfolio, setErrors)) return;

      if (user_id) {
        dispatch(createPortfolio(portfolio))
          .then(() => {
            setSaving(false);
            handleClose();
          })
          .catch((error) => {
            setSaving(false);
            setErrors({ onSave: error.message });
            setSaving(false);
          });
      } else {
        // const checkSameName = portfolios.filter(
        //   (port) => port.port_name === portfolio.port_name
        // );

        // if (checkSameName.length > 0) {
        //   setErrors({ onSave: "Portfolio name already exists!" });
        //   setSaving(false);
        //   return;
        // }
        const publicPortfolio = { ...portfolio, existing: true };

        dispatch(createPortfolioPublic(publicPortfolio));
        resetOnClose();
      }
    }
  }

  return (
    <RenamePortfolioForm
      port_name={portfolio.port_name}
      saving={saving}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      handleClose={resetOnClose}
    />
  );
}

RenamePortfolio.propTypes = {
  handleClose: PropTypes.func.isRequired,
  portfolioId: PropTypes.number,
};

export default RenamePortfolio;
