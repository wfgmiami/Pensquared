import React from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

const RenameBrokerForm = ({
  broker_name,
  saving,
  errors = {},
  onChange,
  onSave,
  handleClose,
}) => {
  const checkErrors = Object.keys(errors).length > 0;
  // console.log("broker_name: ", broker_name, " errors: ", errors);
  return (
    <form onSubmit={onSave}>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <h4 style={{ textAlign: "center" }}>Rename Broker</h4>
      <TextInput
        name="broker_name"
        label="Broker Name"
        // value={broker_name} - initiall broker_name is 'undefined'-because of this the input field becomes 'uncontrolled', later once broker_name is defined, it becomes 'controlled'
        value={broker_name}
        // another solution is value={broker_name || ""}
        error={errors.broker_name}
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

RenameBrokerForm.propTypes = {
  broker_name: PropTypes.string,
  saving: PropTypes.bool,
  errors: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RenameBrokerForm;
