import React from "react";
import PropTypes from "prop-types";

const DeletePortfolioForm = ({ errors = {}, handleClose, onDelete }) => {
  return (
    <form onSubmit={onDelete}>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <h4 style={{ textAlign: "center" }}>Delete Portfolio</h4>
      <p>Are you sure you want to delete this portfolio?</p>
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

DeletePortfolioForm.propTypes = {
  errors: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeletePortfolioForm;
