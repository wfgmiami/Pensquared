import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  Link,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../../redux/actions/userActions";
import { removePortfolios } from "../../redux/actions/portfolioActions";
import { removeBrokers } from "../../redux/actions/brokerActions";
import { removeHoldings } from "../../redux/actions/holdingActions";
import { removeBuyTransactions } from "../../redux/actions/transactionActions";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: "#333f48",
    paddingRight: "79px",
    paddingLeft: "118px",
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
  },
  logo: {
    fontFamily: "Work Sans, sans-serif",
    fontWeight: 600,
    color: "#4287F5",
    textAlign: "left",
  },
  menuButton: {
    "&:focus": {
      textDecoration: "underline",
    },
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 700,
    size: "18px",
    marginLeft: "38px",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerContainer: {
    padding: "20px 30px",
  },
  loginSection: {
    display: "flex",
    float: "right",
  },
  loginUser: {
    color: "#2E8B57",
    fontWeight: 600,
    padding: "10px",
  },
}));

export default function Header({ userInfo }) {
  const {
    header,
    logo,
    menuButton,
    toolbar,
    drawerContainer,
    loginSection,
    loginUser,
  } = useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;
  const dispatch = useDispatch();

  let buttonRefs = useRef([]);
  buttonRefs.current = [1, 2, 3, 4].map(
    (ref, index) => (buttonRefs.current[index] = React.createRef())
  );

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  // console.log("Header userInfo: ", userInfo);

  const handleLinkClick = (l) => {
    dispatch(signOutUser());
    dispatch(removePortfolios());
    dispatch(removeBrokers());
    dispatch(removeHoldings());
    dispatch(removeBuyTransactions());
  };

  const headersData = [
    {
      label: "Portfolios",
      href: "/portfolios",
      idx: "1",
    },
    {
      label: "Brokers",
      href: "/brokers",
      idx: "2",
    },
    {
      label: "Contact Us",
      href: "/contactus",
      idx: "3",
    },
    {
      label: `${userInfo ? "Sign Out" : "Sign In"}`,
      href: `${userInfo ? "/" : "/signin"}`,
      idx: "4",
    },
  ];

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        {siteLogo}
        <div style={{ display: "flex" }}>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>

        <div>{siteLogo}</div>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }) => {
      const menuItem =
        label === "Sign Out" ? (
          <React.Fragment key={label}>
            <Link
              onClick={handleLinkClick}
              {...{
                component: RouterLink,
                to: href,
                color: "inherit",
                style: { textDecoration: "none" },
              }}
            >
              <MenuItem>{label}</MenuItem>
            </Link>
            <div className={loginSection}>
              <Avatar />
              <div className={loginUser}>{userInfo.user_name}</div>
            </div>
          </React.Fragment>
        ) : (
          <Link
            key={label}
            {...{
              component: RouterLink,
              to: href,
              color: "inherit",
              style: {
                textDecoration: "none",
              },
            }}
          >
            <MenuItem>{label}</MenuItem>
          </Link>
        );
      return menuItem;
    });
  };

  const siteLogo = (
    <Link
      {...{
        to: "/",
        component: RouterLink,
        style: { textDecoration: "none" },
      }}
    >
      <Typography variant="h6" component="h1" className={logo}>
        MUISTOCKS
      </Typography>
    </Link>
  );

  const getMenuButtons = () => {
    return headersData.map(({ label, href, idx }) => {
      const menuItem =
        label === "Sign Out" ? (
          <React.Fragment key={label}>
            <Button
              ref={buttonRefs.current[idx]}
              tabIndex={idx}
              onClick={handleLinkClick}
              key={label}
              {...{
                // key: label,
                color: "inherit",
                to: href,
                component: RouterLink,
                className: menuButton,
              }}
            >
              {label}
            </Button>
            <div className={loginSection}>
              <Avatar />
              <div className={loginUser}>{userInfo.user_name}</div>
            </div>
          </React.Fragment>
        ) : (
          <Button
            ref={buttonRefs.current[idx]}
            tabIndex={idx}
            key={label}
            value={idx}
            {...{
              // key: label,
              color: "inherit",
              to: href,
              component: RouterLink,
              className: menuButton,
            }}
          >
            {label}
          </Button>
        );
      return menuItem;
    });
  };

  return (
    <header>
      <AppBar className={header}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </header>
  );
}
