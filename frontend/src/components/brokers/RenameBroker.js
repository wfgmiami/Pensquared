import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addBroker, addBrokerPublic } from "../../redux/actions/brokerActions";
import RenameBrokerForm from "./RenameBrokerForm";
import { brokerIsValid } from "../common/FormIsValid";

function RenameBroker({ brokerId, brokerName, handleClose }) {
  const [broker, setBroker] = useState({ broker_name: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();
  const brokers = useSelector((state) => state.brokers.brokersList);
  const userInfo = useSelector((state) => state.user.userInfo);
  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }
  // console.log("brokers: ", brokers, "brokerId: ", brokerId);

  useEffect(() => {
    if (brokerId) {
      const broker = brokers.find((broker) => broker.broker_id === brokerId);
      setBroker(broker);
    }
  }, [brokerId]);

  useEffect(() => {
    if (brokerId) {
      const broker = brokers.find((broker) => broker.broker_id === brokerId);
      setBroker(broker);
    }
  }, [brokerName]);

  function handleChange(event) {
    const { name, value } = event.target;
    setErrors({});

    setBroker((prevBroker) => ({
      ...prevBroker,
      [name]: value,
      user_id,
    }));
  }

  function resetOnClose() {
    const broker = brokers.find((broker) => broker.broker_id === brokerId);
    setBroker(broker);
    setErrors({});
    setSaving(false);
    handleClose();
  }

  function handleSave(event) {
    event.preventDefault();
    const origBroker = brokers.find((broker) => broker.broker_id === brokerId);

    if (origBroker.broker_name === broker.broker_name) {
      resetOnClose();
      return;
    } else {
      if (!brokerIsValid(broker, setErrors)) return;
      setSaving(true);

      if (user_id) {
        dispatch(addBroker(broker))
          .then(() => {
            setSaving(false);
            handleClose();
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
        const publicBroker = { ...broker, existing: true };
        dispatch(addBrokerPublic(publicBroker));
        resetOnClose();
      }
    }
  }

  return (
    <RenameBrokerForm
      broker_name={broker.broker_name}
      saving={saving}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      handleClose={resetOnClose}
    />
  );
}

RenameBroker.propTypes = {
  handleClose: PropTypes.func.isRequired,
  brokerId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
};

export default RenameBroker;
