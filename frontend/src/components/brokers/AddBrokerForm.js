import React from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

const CreateBrokerForm = ({
  broker,
  onSave,
  onChange,
  errors = {},
  handleClose,
  saving,
}) => {
  const checkErrors = Object.keys(errors).length > 0;
  // console.log("CreateBrokerForm: ", broker, " errors: ", errors);

  return (
    <form onSubmit={onSave}>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <h4 style={{ textAlign: "center" }}>Add Broker</h4>
      <TextInput
        name="broker_name"
        label="Broker Name"
        value={broker.broker_name}
        error={errors.broker_name}
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

CreateBrokerForm.propTypes = {
  errors: PropTypes.object,
  broker: PropTypes.object.isRequired,

  handleClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default CreateBrokerForm;
