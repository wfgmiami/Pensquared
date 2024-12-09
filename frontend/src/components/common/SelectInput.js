import React from "react";
import PropTypes from "prop-types";

function SelectInput({
  name,
  label,
  value,
  onChange,
  error,
  defaultOption,
  options,
}) {
  // console.log(
  //   "SelectInput: options: ",
  //   options,
  //   " name: ",
  //   name,
  //   " value: ",
  //   value
  // );
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="field">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-control"
        >
          <option value="">{defaultOption}</option>

          {options.map((option) => {
            if (option.text !== defaultOption) {
              return (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              );
            }
            return;
          })}
          {error && <div className="alert alert-danger">{error}</div>}
        </select>
      </div>
    </div>
  );
}

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  defaultOption: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
};

export default SelectInput;
