import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  disBlock: {
    position: "fixed",
    zIndex: theme.zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    background: "rgba(0, 0, 0, 0.6)",
  },
  disNone: {
    display: "none",
  },
  modalContainer: {
    position: "absolute",
    width: "60%",
    background: "#ffffff",
    left: "25%",
    top: "30%",
    padding: "20px",
  },
}));

const Modal = ({ show, children }) => {
  const classes = useStyles();

  const showHideClassName = show ? classes.disBlock : classes.disNone;

  return (
    <div className={showHideClassName}>
      <div className={classes.modalContainer}>{children}</div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
};
export default Modal;
