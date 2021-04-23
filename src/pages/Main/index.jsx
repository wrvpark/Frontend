// Imports
import React, { Component } from "react";
import { Layout } from "antd";
import { Redirect, Route, Switch } from "react-router-dom";
import SideMenu from "../../Components/NaviMenu/sideMenu";

// Project components
import Login from "../Login";
import HomePage from "../HomePage";
import Event from "../Event";
import CreateEvent from "../Event/CreateEvent";
import ParkDocument from "../ParkDocument";
import Forum from "../Forum";
import SaleAndRent from "../SaleAndRent";
import LostAndFound from "../LostAndFound";
import Services from "../Services";
import Admin from "../Admin";
import Settings from "../Settings";

// Load categories
import { LoadCategories } from "../../Components/LoadCategories/loadCategories";

const { Sider, Content } = Layout;

/**
 * @author Charles Breton Isabel Ke Illia Bondarenko
 * 
 */
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: true,
      collapsed: false,
    };
  }

  // Handle call back for side menu
  handleCallback = (childData) => {
    this.setState({ collapsed: childData });
  };

  // Render component
  render() {
    return (
      <Layout style={{ height: "100%" }}>
        <LoadCategories />
        <Sider
          width={230}
          background={"none"}
          collapsible
          collapsedWidth={70}
          collapsed={this.state.collapsed}
        >
          <SideMenu parentCallback={this.handleCallback} />
        </Sider>
        
        {/* Handle the different section in our website */}
        <Layout>
          <Content>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={Login} />
              <Route path="/documents" component={ParkDocument} />
              <Route path="/forum" component={Forum} />
              <Route path="/event" exact component={Event} />
              <Route path="/event/create" component={CreateEvent} />
              <Route path="/saleAndRent" component={SaleAndRent} />
              <Route path="/lostAndFound" component={LostAndFound} />
              <Route path="/services" component={Services} />
              <Route path="/admin" component={Admin} />
              <Route path="/settings" component={Settings} />

              <Redirect to="/" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
