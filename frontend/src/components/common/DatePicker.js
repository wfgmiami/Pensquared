// import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
import DateConverter from "./DateCoverter";

// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: "flex",
//     flexWrap: "wrap",
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: 200,
//   },
// }));

// export default function DatePicker(props) {
//   const classes = useStyles();

//   const tradeDate = DateConverter(props.tradeDate, "yyyy-mm-dd");

//   console.log("props: ", props, "tradeDate", tradeDate);

//   return (
//     <form className={classes.container} noValidate>
//       <TextField
//         id="date"
//         type="date"
//         defaultValue={tradeDate}
//         className={classes.textField}
//         InputLabelProps={{
//           shrink: true,
//         }}
//       />
//     </form>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function DatePicker(props) {
  const [selectedDate, setSelectedDate] = useState(props.tradeDate);
  const { onSelectDate } = props;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        autoOk
        variant="inline"
        value={props.tradeDate}
        onChange={onSelectDate}
        format="MM/dd/yy"
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePicker;
