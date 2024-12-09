import React from "react";
import PropTypes from "prop-types";

const DeleteForm = ({ errors = {}, handleClose, onDeleteConfirm, type }) => {
  let msgHeader = "Delete Transaction";
  let msgBody = "Are you sure you want to delete this transaction?";

  if (type === "holding") {
    msgHeader = "Delete Portfolio Holding";
    msgBody = "Are you sure you want to delete this portfolio holding?";
  }

  return (
    <form onSubmit={onDeleteConfirm}>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <h4 style={{ textAlign: "center" }}>{msgHeader}</h4>
      <p>{msgBody}</p>
      &nbsp;
      <button type="submit" className="btn btn-primary">
        Delete
      </button>{" "}
      <button type="button" className="btn btn-secondary" onClick={handleClose}>
        Cancel
      </button>
    </form>
  );
};

DeleteForm.propTypes = {
  errors: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteForm;
