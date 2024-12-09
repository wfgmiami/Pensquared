import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Settings from "@material-ui/icons/Settings";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import {
  loadBrokers,
  savePublicBrokers,
} from "../../redux/actions/brokerActions";
import Modal from "../common/Modal";
import AddBroker from "./AddBroker";
import RenameBroker from "./RenameBroker";
import DeleteBroker from "./DeleteBroker";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);

function BrokersTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState({});
  const [isCreateBrokerOpen, toggleCreateBroker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRenameBrokerOpen, toggleRenameBroker] = useState(false);
  const [isDeleteBrokerOpen, toggleDeleteBroker] = useState(false);

  const brokers = useSelector((state) => state.brokers.brokersList);
  // const userInfo = useSelector((state) => state.user.userInfo);

  // let user_id = null;

  // if (userInfo) {
  //   user_id = userInfo.user_id;
  // }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const handleClick = (event, row) => {
    const brk = { brokerId: row.broker_id, brokerName: row.broker_name };
    setSelected(brk);
  };

  const isSelected = (broker_id) => selected.brokerId === broker_id;

  const handleDelete = (e) => {
    setAnchorEl(null);
    toggleDeleteBroker(true);
    e.stopPropagation();
  };

  const handleRename = (e) => {
    setAnchorEl(null);
    toggleRenameBroker(true);
    e.stopPropagation();
  };

  const handleEditClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    e.stopPropagation();
  };

  const open = Boolean(anchorEl);

  const id = open ? "settings-popover" : undefined;

  return (
    <>
      <Modal
        show={isCreateBrokerOpen}
        handleClose={() => toggleCreateBroker(!isCreateBrokerOpen)}
      >
        <AddBroker
          handleClose={() => toggleCreateBroker(!isCreateBrokerOpen)}
        />
      </Modal>
      <Modal
        show={isDeleteBrokerOpen}
        handleClose={() => toggleDeleteBroker(!isDeleteBrokerOpen)}
      >
        <DeleteBroker
          brokerId={selected.brokerId ? selected.brokerId : null}
          handleClose={() => toggleDeleteBroker(!isDeleteBrokerOpen)}
        />
      </Modal>

      <Modal
        show={isRenameBrokerOpen}
        handleClose={() => toggleRenameBroker(!isRenameBrokerOpen)}
      >
        <RenameBroker
          brokerId={selected.brokerId ? selected.brokerId : null}
          brokerName={selected.brokerName ? selected.brokerName : null}
          handleClose={() => toggleRenameBroker(!isRenameBrokerOpen)}
        />
      </Modal>

      <Paper className={classes.root}>
        <div className={classes.drawerHeader} />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox">
                <IconButton
                  aria-label="create-broker"
                  size="small"
                  onClick={() => toggleCreateBroker(!isCreateBrokerOpen)}
                >
                  <AddIcon />
                </IconButton>
              </StyledTableCell>

              <StyledTableCell>Broker Name</StyledTableCell>
              <StyledTableCell align="right">Symbols</StyledTableCell>
              <StyledTableCell align="right">Market Value</StyledTableCell>
              <StyledTableCell align="right">Day Change</StyledTableCell>
              <StyledTableCell align="right">Day Change %</StyledTableCell>
              <StyledTableCell align="right">Total Change</StyledTableCell>
              <StyledTableCell align="right">Total Change %</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {brokers.map((row, index) => {
              const isItemSelected = isSelected(row.broker_id);
              const labelId = `brokers-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row)}
                  role="checkbox"
                  key={row.broker_id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <IconButton
                      aria-label="edit-broker"
                      size="small"
                      onClick={handleEditClick}
                    >
                      <Settings />
                    </IconButton>

                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                    >
                      <div className="dropdownMenu">
                        <ul>
                          <li>
                            <a href="#" onClick={handleRename}>
                              Rename Broker
                            </a>
                            <a href="#" onClick={handleDelete}>
                              Delete Broker
                            </a>
                          </li>
                        </ul>
                      </div>
                    </Popover>
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.broker_name}
                  </TableCell>
                  <TableCell align="right">{row.symbols}</TableCell>
                  <TableCell align="right">
                    {row.mv ? formatter.format(row.mv) : row.mv}
                  </TableCell>
                  <TableCell align="right">
                    {row.portDayChange
                      ? formatter.format(row.portDayChange)
                      : row.portDayChange}
                  </TableCell>
                  <TableCell align="right">{row.dayChangePct}</TableCell>
                  <TableCell align="right">
                    {row.ugl ? formatter.format(row.ugl) : row.ugl}
                  </TableCell>
                  <TableCell align="right">{row.totalChangePct}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

export default BrokersTable;
