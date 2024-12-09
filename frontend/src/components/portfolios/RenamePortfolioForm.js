import React from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

const RenamePortfolioForm = ({
  port_name,
  saving,
  errors = {},
  onSave,
  onChange,
  handleClose,
}) => {
  const checkErrors = Object.keys(errors).length > 0;
  // console.log("port_name: ", port_name, " errors: ", errors);
  return (
    <form onSubmit={onSave}>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <h4 style={{ textAlign: "center" }}>Rename Portfolio</h4>
      <TextInput
        name="port_name"
        label="Portfolio Name"
        // value={port_name} - initiall port_name is 'undefined'-because of this the input field becomes 'uncontrolled', later once port_name is defined, it becomes 'controlled'
        value={port_name}
        // another solution is value={port_name || ""}
        error={errors.port_name}
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

RenamePortfolioForm.propTypes = {
  port_name: PropTypes.string,
  saving: PropTypes.bool,
  errors: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RenamePortfolioForm;
