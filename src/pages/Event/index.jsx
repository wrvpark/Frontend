import React, { Component } from "react";
import { Card, Button } from "antd";
import { NavLink } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

// Project imports
import EventCalendar from "./Calendar/EventCalendar";
import SideMenu from "./SearchMenu/actionMenu";

// Css files
import "./event.css";

// Access token
const token = localStorage.getItem("access_token");

/**
 * Event Component that handles Home Page
 * 
 * @author Charles Breton Illia Bondarenko
 * @returns Event Home Page
 */
export default class Event extends Component {
  constructor() {
    super();
    this.state = {};
  }

// Set initial setting for event section logic
  componentDidMount() {
    localStorage.setItem("load_files", null)
    localStorage.setItem("load_section", 8);
    localStorage.setItem("upload_type", "")
  }

  // Determine if user is logged in or out
  checkLoggedIn = () => {
    if (token !== null) {
      return true;
    }
    return false;
  };


  // Prevent redirect when clicking on Post Details header
  handleClick = (e) => {
    e.preventDefault();
  };

  // Render Event Component
  render() {
    // Header info
    const title = (
      <span className="header">
        <NavLink to="/event" exact className="backToEvent">
          EVENT
        </NavLink>
        <h1> {">"} </h1>

        {/* Add button */}
        {this.checkLoggedIn() ? (
          <Button
            className="event_create_post_button"
            size="large"
            type="primary"
            onClick={() => this.props.history.push("/event/create")}
          >
            <PlusOutlined />
          Add
          </Button>

        ) :
          null}
      </span>
    );

    // Main component handling the different component on the page
    return (
      <Card title={title} className="calendar_page">
        <div>
          <SideMenu dataFromParent={this.state.events} />

          <EventCalendar dataFromParent={this.state.events} />
        </div>
      </Card>
    );
  }
}
