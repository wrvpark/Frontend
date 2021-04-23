import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styles from "./sideMenu.module.css";
import "./sideMenu.module.css";
import { ReactComponent as HomeLogo } from "./ICONS/HomeLogo.svg";
import { ReactComponent as EventsLogo } from "./ICONS/EventsLogo.svg";
import { ReactComponent as DocumentLogo } from "./ICONS/DocumentLogo.svg";
import { ReactComponent as SaleRentLogo } from "./ICONS/SaleRentLogo.svg";
import { ReactComponent as ForumLogo } from "./ICONS/ForumLogo.svg";
import { ReactComponent as LostFoundLogo } from "./ICONS/LostFoundLogo.svg";
import { ReactComponent as ServicesLogo } from "./ICONS/ServicesLogo.svg";
import { ReactComponent as LogOutLogo } from "./ICONS/LogOutLogo.svg";
import { ReactComponent as LogsLogo } from "./ICONS/LogsLogo.svg";
import { ReactComponent as UsersLogo } from "./ICONS/UsersLogo.svg";
import { ReactComponent as SettingsLogo } from "./ICONS/SettingsLogo.svg";

import ThreeDots from '../../images/three_dots.svg'
import { NavLink } from "react-router-dom";
import "./btnStyle.css";
import { message } from "antd";

export default class NavButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileNavIsDisplayed: false,
      isAdmin: false
    };
  }

  // componentDidMount(prevProps, prevState) {
  //   this.checkAccountPermission(prevProps, prevState);
  // }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dataParentToChild !== prevProps.dataParentToChild) {
      this.setState({ profileNavIsDisplayed: !this.props.dataParentToChild });
    }

    if (this.props.isAdminData !== prevProps.isAdminData) {
      this.setState({ isAdmin: this.props.isAdminData });
    }
    
    // this.checkAccountPermission(prevProps, prevState);
  }
  
  // checkAccountPermission = () => {
  //   const token = localStorage.getItem("access_token");

  //   if (token !== null) {
  //     const token_info = JSON.parse(localStorage.getItem("session_details"));
  //     for (let i = 0; i < token_info.realm_access.roles.length; i++) {
  //       if (token_info.realm_access.roles[i] === "admin" ) {
  //         this.setState({ isAdmin: true });
  //         console.log("isAdmin")
  //       } else  {
  //         this.setState({ isAdmin: false });
  //         console.log("notAdmin")
  //       }
  //     }
  //   }
  // };

  handleLogOut = () => {
    message.success("Logout Successful.", 5);
    this.props.parentCallback(true);
    this.setState({ profileNavIsDisplayed: false });

    localStorage.clear()

    // window.location.reload();
  }

  render() {
    return (
      <div>
        <Container>
          <Row hidden={this.state.profileNavIsDisplayed}>
            <ButtonGroup vertical className={styles.btnGroup}>
              <NavLink to="/" exact className={"btn"} activeClassName="active">
                <HomeLogo className={"navLogo"} />
                <span>Home</span>
              </NavLink>
              <NavLink to="/event" className={"btn"} activeClassName="active">
                <EventsLogo className={"navLogo"} />
                <span>Events</span>
              </NavLink>
              <NavLink
                to="/documents"
                exact
                className={"btn"}
                activeClassName="active"
              >
                <DocumentLogo className={"navLogo"} />
                <span>Park Documents</span>
              </NavLink>
              <NavLink
                to="/saleAndRent"
                exact
                className={"btn"}
                activeClassName="active"
              >
                <SaleRentLogo className={"navLogo"} />
                <span>Sale & Rent</span>
              </NavLink>
              <NavLink
                to="/forum"
                exact
                className={"btn"}
                activeClassName="active"
              >
                <ForumLogo className={"navLogo"} />
                <span>Forum</span>
              </NavLink>
              <NavLink
                to="/lostAndFound"
                exact
                className={"btn"}
                activeClassName="active"
              >
                <LostFoundLogo className={"navLogo"} />
                <span>Lost & Found</span>
              </NavLink>
              <NavLink
                to="/services"
                exact
                className={"btn"}
                activeClassName="active"
              >
                <ServicesLogo className={"navLogo"} />
                <span>Services</span>
              </NavLink>
            </ButtonGroup>
          </Row>

          <Row hidden={!this.state.profileNavIsDisplayed || !this.state.isAdmin}>
            <ButtonGroup vertical className={styles.btnGroup}>
              <NavLink to="/admin/accountsDetails" exact className={"btn"} activeClassName="active">
                <UsersLogo className={"navLogo"} />
                <span>User Details</span>
              </NavLink>
              <NavLink to="/admin/logs" exact className={"btn"} activeClassName="active">
                <LogsLogo className={"navLogo"} />
                <span>Logs</span>
              </NavLink>
              <NavLink to="/settings" exact className={"btn"} activeClassName="active">
                <SettingsLogo className={"navLogo"} />
                <span>Setting</span>
              </NavLink>
              <NavLink to="/" exact className={"btn"} activeClassName="active" onClick={this.handleLogOut} >
                <LogOutLogo className={"navLogo"} />
                <span>Log Out</span>
              </NavLink>
            </ButtonGroup>
          </Row>

          <Row hidden={!this.state.profileNavIsDisplayed || this.state.isAdmin}>
            <ButtonGroup vertical className={styles.btnGroup}>
              <NavLink to="/settings" exact className={"btn"} activeClassName="active">
                <SettingsLogo className={"navLogo"} />
                <span>Setting</span>
              </NavLink>
              <NavLink to="/" exact className={"btn"} activeClassName="active"  onClick={this.handleLogOut}>
                <LogOutLogo className={"navLogo"} />
                <span>Log Out</span>
              </NavLink>
            </ButtonGroup>
          </Row>
        </Container>
      </div>
    );
  }
}
