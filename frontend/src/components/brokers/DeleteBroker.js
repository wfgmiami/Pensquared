import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  deleteBroker,
  deleteBrokerPublic,
} from "../../redux/actions/brokerActions";
import DeleteBrokerForm from "./DeleteBrokerForm";

function DeleteBroker({ brokerId, handleClose }) {
  const [broker, setBroker] = useState({});
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const brokers = useSelector((state) => state.brokers.brokersList);
  const userInfo = useSelector((state) => state.user.userInfo);
  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }

  // console.log(
  //   "DeleteBroker: brokers: ",
  //   brokers,
  //   "user_id:",
  //   user_id,
  //   "userInfo: ",
  //   userInfo
  // );

  useEffect(() => {
    if (brokerId) {
      const broker = brokers.find((broker) => broker.broker_id === brokerId);
      setBroker(broker);
    }
  }, [brokerId]);

  function resetOnClose() {
    const broker = brokers.find((broker) => broker.broker_id === brokerId);
    setBroker(broker);
    setErrors({});
    handleClose();
  }

  function handleDelete(event) {
    event.preventDefault();
    const broker_id = broker.broker_id;
    if (user_id) {
      dispatch(deleteBroker(broker_id))
        .then(() => {
          handleClose();
        })
        .catch((error) => {
          setErrors({ onSave: error.message });
          resetOnClose();
        });
    } else {
      dispatch(deleteBrokerPublic(broker_id));
      resetOnClose();
    }
  }

  return (
    <DeleteBrokerForm
      broker_name={broker.broker_name}
      errors={errors}
      onDelete={handleDelete}
      handleClose={resetOnClose}
    />
  );
}

DeleteBroker.propTypes = {
  handleClose: PropTypes.func.isRequired,
  brokerId: PropTypes.number,
};

export default DeleteBroker;
