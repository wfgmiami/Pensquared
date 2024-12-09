import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

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

import Modal from "../common/Modal";
import CreatePortfolio from "./CreatePortfolio";
import RenamePortfolio from "./RenamePortfolio";
import DeletePortfolio from "./DeletePortfolio";

import { removePublicHolding } from "../../redux/actions/holdingActions";
import { loadBuyTransactions } from "../../redux/actions/transactionActions";
import {
  loadPortfolios,
  savePublicPortfolios,
  loadPortfoliosList,
} from "../../redux/actions/portfolioActions";
import {
  loadBrokers,
  savePublicBrokers,
} from "../../redux/actions/brokerActions";
import { updateBuyTransaction } from "../../redux/actions/transactionActions";
import { numTwoDecimal } from "../common/NumberFormat";
import { getPortfolios } from "../../utils/common";

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

function PortfoliosTable({ ...props }) {
  // when accessed by public user, portfolioList is populated directly from the state
  // when access by public user who just singed up, useEffect() dispatches to save any portfolios and brokers that were entered by the public user
  // when accessed by user, useEffect() triggers loadPortfolios
  const classes = useStyles();
  const dispatch = useDispatch();

  // const [portfolios, setPortfolios] = useState([]);
  const [selected, setSelected] = useState({});
  const [isCreatePortOpen, toggleCreatePort] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRenamePortOpen, toggleRenamePort] = useState(false);
  const [isDeletePortOpen, toggleDeletePort] = useState(false);

  // const buyTransactions = useSelector(
  //   (state) => state.transactions.buyTransactions
  // );

  const newTransaction = useSelector(
    (state) => state.transactions.newTransaction
  );

  const portfoliosList = useSelector(
    (state) => state.portfolios.portfoliosList
  );
  const holdingsList = useSelector((state) => state.holdings.holdingsList);
  const brokersList = useSelector((state) => state.brokers.brokersList);
  const userInfo = useSelector((state) => state.user.userInfo);

  let user_id = null;

  if (userInfo) {
    user_id = userInfo.user_id;
  }
  const { location } = props;
  const signupPage = location.state
    ? location.state.referrerPage === "signupPage"
    : false;
  const signinPage = location.state
    ? location.state.referrerPage === "signinPage"
    : false;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  console.log("portfoliosList: ", portfoliosList);

  useEffect(() => {
    console.log("useEffect: [user_id] ", user_id);

    // save any public portfolios on signup
    if (user_id && signupPage && portfoliosList.length > 0) {
      // const portWithUserId = portfoliosList.map((port) => ({
      //   ...port,
      //   user_id,
      // }));
      // dispatch(savePublicPortfolios(portWithUserId));

      // if (brokersList.length > 0) {
      //   const brokersWithUserId = brokersList.map((port) => ({
      //     ...port,
      //     user_id,
      //   }));
      //   dispatch(savePublicBrokers(brokersWithUserId));
      // }

      let portTrans = [];

      if (holdingsList.length > 0) {
        holdingsList.map((port, idx) => {
          // console.log("idx: ", idx, " port:", port);
          // port = [1: [{symbol:'FB', port_id:1}, {symbol: 'F', port_id:1}] ]
          let portKey = Object.keys(port);
          // portKey = ["1"]
          let portHold = port[portKey];

          // portHold = [ {symbol:'FB', port_id:1}, {symbol: 'F', port_id:1} ]
          for (let k = 0; k < portHold.length; k++) {
            let trans = portHold[k];
            // trans = {symbol:'FB', port_id:1}

            let transValue = `('${trans.symbol}', ${trans.shares}, ${trans.port_id}, '${trans.port_name}', '${user_id}')`;

            portTrans.push(transValue);
          }
        });

        console.log("portHold: ", portTrans);

        // transValues = [ "('FB', 0, 1, 'ipo', '60')", "('DISCA', 0, 1, 'ipo', '60')", "('IESC', 0, 2, 'test', '60')", "('ABNB', 0, 2, 'test', '60')" ]

        // const newSymbol = {
        //   ...newTransaction,
        //   symbol: symbol.symbol_name,
        //   user_id,
        //   port_id,
        //   port_name,
        // };

        // dispatch(updateBuyTransaction(newSymbol));
      }
    } else if (user_id && signinPage) {
      // API call only on signin
      dispatch(loadPortfolios(user_id));

      //do not load brokers buy get the info for it from the buyTransactions
      // dispatch(loadBrokers(user_id));
      // dispatch(removePublicHolding()); // clear the public holdings when user signs in
    }
    //  else if (user_id) {
    //   dispatch(loadBuyTransactions(user_id));
    //   dispatch(loadBrokers(user_id));
    // }
  }, []);

  // useEffect(() => {
  //   console.log("useEffect: [buyTransactions]: ", buyTransactions);

  //   const portfolios = getPortfolios(buyTransactions, user_id);

  //   // // setPortfolios(portfolios);
  //   dispatch(loadPortfoliosList(portfolios));
  // }, []);

  // useEffect(() => {
  //   // console.log("useEffect: [portfoliosList]: ", portfoliosList);
  //   const portIds = portfolios.map((port) => port.port_id).length;
  //   const portListIds = portfoliosList.map((port) => port.port_id).length;

  //   // console.log("portIds: ", portIds, "portListIds: ", portListIds);

  //   if (portIds > 0 && portListIds > 0) {
  //     if (portListIds > portIds || portListIds < portIds) {
  //       setPortfolios(portfoliosList);
  //     } else {
  //       const portListNames = portfoliosList.map((port) => port.port_name);
  //       const portNames = portfolios.map((port) => port.port_name);

  //       const diffPortName = portListNames.map((portListNm) => {
  //         return portNames.includes(portListNm);
  //       });

  //       if (diffPortName.length > 0 && diffPortName.includes(false))
  //         setPortfolios(portfoliosList);
  //     }
  //   }
  // }, [portfoliosList]);

  const handleClick = (event, row) => {
    const port = { portfolioId: row.port_id, portfolioName: row.port_name };
    setSelected(port);
  };

  const isSelected = (port_id) => selected.portfolioId === port_id;

  const handleDelete = (e) => {
    setAnchorEl(null);
    toggleDeletePort(true);
    e.stopPropagation();
  };

  const handleRename = (e) => {
    setAnchorEl(null);
    toggleRenamePort(true);
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
        show={isCreatePortOpen}
        handleClose={() => toggleCreatePort(!isCreatePortOpen)}
      >
        <CreatePortfolio
          handleClose={() => toggleCreatePort(!isCreatePortOpen)}
        />
      </Modal>
      <Modal
        show={isDeletePortOpen}
        handleClose={() => toggleDeletePort(!isDeletePortOpen)}
      >
        <DeletePortfolio
          portfolioId={selected.portfolioId ? selected.portfolioId : null}
          portfolios={portfoliosList}
          handleClose={() => toggleDeletePort(!isDeletePortOpen)}
        />
      </Modal>

      <Modal
        show={isRenamePortOpen}
        handleClose={() => toggleRenamePort(!isRenamePortOpen)}
      >
        <RenamePortfolio
          portfolios={portfoliosList}
          portfolioId={selected.portfolioId ? selected.portfolioId : null}
          portfolioName={selected.portfolioName ? selected.portfolioName : null}
          handleClose={() => toggleRenamePort(!isRenamePortOpen)}
        />
      </Modal>

      <Paper className={classes.root}>
        <div className={classes.drawerHeader} />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox">
                <IconButton
                  aria-label="create-portfolio"
                  size="small"
                  onClick={() => toggleCreatePort(!isCreatePortOpen)}
                >
                  <AddIcon />
                </IconButton>
              </StyledTableCell>

              <StyledTableCell>Portfolio Name</StyledTableCell>
              <StyledTableCell align="right">Symbols</StyledTableCell>
              <StyledTableCell align="right">Market Value</StyledTableCell>
              <StyledTableCell align="right">Day Change</StyledTableCell>
              <StyledTableCell align="right">Day Change %</StyledTableCell>
              <StyledTableCell align="right">Total Change</StyledTableCell>
              <StyledTableCell align="right">Total Change %</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {portfoliosList.map((row, index) => {
              const isItemSelected = isSelected(row.port_id);
              const labelId = `portfolios-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row)}
                  role="checkbox"
                  key={row.port_id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <IconButton
                      aria-label="edit-portfolio"
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
                              Rename Portfolio
                            </a>
                            <a href="#" onClick={handleDelete}>
                              Delete Portfolio
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
                    <Link
                      color="inherit"
                      to={`/portfolios/${row.port_name}/${row.port_id}`}
                    >
                      {row.port_name}
                    </Link>
                    {/* <a href={`/portfolios/${row.port_id}`}>{row.port_name}</a> */}
                  </TableCell>
                  <TableCell align="right">
                    {row.symbols ? row.symbols : 0}
                  </TableCell>
                  <TableCell align="right">
                    {row.mv ? formatter.format(row.mv) : 0}
                  </TableCell>
                  <TableCell align="right">
                    {row.ugl_day ? formatter.format(row.ugl_day) : 0}
                  </TableCell>
                  <TableCell align="right">
                    {row.ugl_day_percent
                      ? formatter.format(row.ugl_day_percent)
                      : 0}
                    %
                  </TableCell>
                  <TableCell align="right">
                    {row.ugl ? formatter.format(row.ugl) : 0}
                  </TableCell>
                  <TableCell align="right">
                    {row.ugl_percent ? formatter.format(row.ugl_percent) : 0}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

export default PortfoliosTable;
