import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import Logo from "./logo";
import NavButtons from "./navButtons.jsx";
import Profile from "./profile";
// import styles from "./sideMenu.module.css";
import "./navMenu.css";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

export default class SideMenu extends React.Component {
  constructor() {
    super();
    this.handleCallback = this.handleCallback.bind(this);
    this.state = {
      menuOpen: true,
      profileNavIsDisplayed: false,
      logOut: false,
      isAdmin: false,
    };
  }

  toggleSideMenu = (e) => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  isSideMenuOpen = (state) => {
    this.setState({ menuOpen: state.isOpen });
    this.props.parentCallback(this.state.menuOpen);
    // console.log(!this.state.menuOpen);
    // state.preventDefault();
    return state.isOpen;
  };

  handleCallback = (childData, logOut) => {
    this.setState({ profileNavIsDisplayed: !childData, logOut: logOut });
    // console.log("sideState "+ this.state.profileNavIsDisplayed);
  };

  handleLogOut = (childData) => {
    this.setState({ logOut: childData });
  };

  componentDidUpdate(prevProps, prevState) {
    this.checkAccountPermission(prevProps, prevState);
  }

  checkAccountPermission = (prevProps, prevState) => {
    const token = localStorage.getItem("access_token");

    if (token !== null) {
      const token_info = JSON.parse(localStorage.getItem("session_details"));
      for (let i = 0; i < token_info.realm_access.roles.length; i++) {
        if (
          prevState.profileNavIsDisplayed !== this.state.profileNavIsDisplayed
        ) {
          if (token_info.realm_access.roles[i] === "admin") {
            this.setState({ isAdmin: true });
          } else {
            this.setState({ isAdmin: false });
          }
        }
      }
    }
  };

  render() {
    return (
      <Menu
        left
        isOpen={this.state.menuOpen}
        onStateChange={this.isSideMenuOpen}
        disableOverlayClick
        burgerButtonClassName={"navMenuButton"}
        crossClassName={"navMenuCross"}
        morphShapeClassName={"navMenuMorph"}
        className={"sideMenu"}
        overlayClassName={"navMenuOverlay"}
        noOverlay
        customCrossIcon={false}
      >
        <Logo />
        <NavButtons
          dataParentToChild={this.state.profileNavIsDisplayed}
          isAdminData={this.state.isAdmin}
          parentCallback={this.handleLogOut}
        />
        <Profile
          dataParentToChild={this.state.profileNavIsDisplayed}
          LogOutData={this.state.logOut}
          parentCallback={this.handleCallback}
        />
      </Menu>
    );
  }
}
