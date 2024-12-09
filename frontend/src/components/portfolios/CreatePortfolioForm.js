import React from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

const CreatePortfolioForm = ({
  portfolio,
  onSave,
  onChange,
  errors = {},
  handleClose,
  saving,
  // portfolioCurrency,
  // portfolioAssetClass,
}) => {
  const checkErrors = Object.keys(errors).length > 0;
  // console.log(
  //   "CreatePortfolioForm: portfolio: ",
  //   portfolio,
  //   " errors: ",
  //   errors,
  //   "checkErrors:",
  //   checkErrors
  // );

  return (
    <form onSubmit={onSave}>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <h4 style={{ textAlign: "center" }}>Create Portfolio</h4>
      <TextInput
        name="port_name"
        label="Portfolio Name"
        value={portfolio.port_name}
        error={errors.port_name}
        onChange={onChange}
      />
      &nbsp;
      <button
        type="submit"
        disabled={saving || checkErrors}
        className="btn btn-primary"
      >
        {saving && !checkErrors ? "Saving..." : "Save"}
      </button>{" "}
      <button type="button" className="btn btn-secondary" onClick={handleClose}>
        Cancel
      </button>
    </form>
  );
};

CreatePortfolioForm.propTypes = {
  errors: PropTypes.object,
  portfolio: PropTypes.object.isRequired,
  // portfolioCurrency: PropTypes.array.isRequired,
  // portfolioAssetClass: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default CreatePortfolioForm;
