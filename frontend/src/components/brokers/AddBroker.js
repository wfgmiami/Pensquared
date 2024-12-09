import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import {
  loadBrokers,
  addBroker,
  addBrokerPublic,
} from "../../redux/actions/brokerActions";
import AddBrokerForm from "./AddBrokerForm";
import { brokerIsValid } from "../common/FormIsValid";

function AddBroker({
  brokers,
  addBroker,
  addBrokerPublic,
  handleClose,
  userInfo,
  ...props
}) {
  const [broker, setNewBroker] = useState({ ...props.broker });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }
  // console.log("AddBroker: props ", props);

  function handleChange(event) {
    const { name, value } = event.target;
    setErrors({});
    setNewBroker((prevBroker) => ({
      ...prevBroker,
      [name]: value,
      user_id,
    }));
  }

  function resetOnClose() {
    setNewBroker({ ...props.broker });
    setErrors({});
    setSaving(false);
    handleClose();
  }

  function handleSave(event) {
    event.preventDefault();
    if (!brokerIsValid(broker, setErrors)) return;
    setSaving(true);

    if (user_id) {
      addBroker(broker)
        .then(() => {
          setSaving(false);
          resetOnClose();
        })
        .catch((error) => {
          setSaving(false);
          setErrors({ onSave: error.message });
          resetOnClose();
        });
    } else {
      const checkSameName = brokers.filter(
        (brk) => brk.broker_name === broker.broker_name
      );

      if (checkSameName.length > 0) {
        setErrors({ onSave: "Broker name already exists!" });
        setSaving(false);
        return;
      }

      let publicBroker = {};

      if (brokers.length > 0) {
        const maxId = Math.max.apply(
          Math,
          brokers.map((brk) => brk.broker_id)
        );
        publicBroker = { ...broker, broker_id: maxId + 1, existing: false };
      } else {
        publicBroker = { ...broker, broker_id: 1, existing: false };
      }

      addBrokerPublic(publicBroker);
      resetOnClose();
    }
  }

  return (
    <AddBrokerForm
      broker={broker}
      errors={errors}
      handleClose={resetOnClose}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

AddBroker.propTypes = {
  addBroker: PropTypes.func.isRequired,
  addBrokerPublic: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  loadBrokers: PropTypes.func.isRequired,
  broker: PropTypes.object.isRequired,
  brokers: PropTypes.array.isRequired,
  userInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
};

function mapStateToProps(state) {
  return {
    brokers: state.brokers.brokersList,
    broker: state.brokers.newBroker,
    userInfo: state.user.userInfo,
  };
}

const mapDispatchToProps = {
  loadBrokers,
  addBroker,
  addBrokerPublic,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddBroker)
);
