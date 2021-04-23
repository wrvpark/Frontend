import React, { Component } from 'react';
import { Layout } from "antd";
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom'

import { LoadCategories } from "./Components/LoadCategories/loadCategories";
import SideMenu from "./Components/NaviMenu/sideMenu";

// import Main from "./pages/Main"
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Event from "./pages/Event";
import CreateEvent from "./pages/Event/CreateEvent";
import UpdateEvent from "./pages/Event/UpdateEvent";
import ParkDocument from "./pages/ParkDocument";
import Forum from "./pages/Forum";
import SaleAndRent from "./pages/SaleAndRent";
import LostAndFound from "./pages/LostAndFound";
import Services from "./pages/Services";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";

const { Sider, Content } = Layout;

/**
 * First component to load the rest of the application
 * 
 * @author Charles Breton Illia Bonkarenko Isabel Ke
 * 
 * @returns Main component of website
 */
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: true,
      collapsed: false,
    };
  }

// Initial call when application starts
  componentDidMount() {
    document.title = "Wendy's RV Park"
  }

  // Handle call backs for side menu
  handleCallback = (childData) => {
    this.setState({ collapsed: childData });
  };

  // Render the different components
  render() {
    return (
      <BrowserRouter>
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
          <Layout>
            <Content>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/login" component={Login} />
                <Route path="/documents" component={ParkDocument} />
                <Route path="/forum" component={Forum} />
                <Route path="/event" exact component={Event} />
                <Route path="/event/create" component={CreateEvent} />
                <Route path="/event/addUpdate" component={UpdateEvent} />
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
      </BrowserRouter>
    )
  }
}
