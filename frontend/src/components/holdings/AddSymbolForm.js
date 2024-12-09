import React from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

const AddSymbolForm = ({
  symbol,
  onSave,
  onChange,
  saving,
  errors = {},
  handleClose,
}) => {
  // console.log("AddSymbolForm: symbol:", symbol, " errors: ", errors);
  const checkErrors = Object.keys(errors).length > 0;
  return (
    <form onSubmit={onSave}>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <TextInput
        name="symbol_name"
        label="Enter Symbol"
        value={symbol.symbol_name}
        error={errors.symbol_name}
        onChange={onChange}
      />
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

AddSymbolForm.propTypes = {
  symbol: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object,
};

export default AddSymbolForm;
