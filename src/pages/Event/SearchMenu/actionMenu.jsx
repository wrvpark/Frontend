// Imports
import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import SearchFeature from './searchFeature';

// Css files
import "../event.css";

/**
 * Event Component that handles action menu for event
 *
 * @author Charles Breton
 * @returns Event Action Menu
 */
export default class SideMenu extends Component {
  constructor() {
    super();
    this.state = {
      events: null,
      menuOpen: false
    };
  }

  // Initial call when component loads
  componentDidMount() {
    this.setState({ events: this.props.dataFromParent })
  }


  // THIS COULD BE REMOVED
  showSettings(event) {
    event.preventDefault();
  }

  // THIS COULD BE REMOVED
  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  // Open or close side menu
  isMenuOpen = (state) => {
    this.setState({ menuOpen: state.isOpen })
    return state.isOpen;
  };

  // Render side menu action
  render() {
    return (
      <Menu right onStateChange={this.isMenuOpen} isOpen={this.state.menuOpen}>
        <SearchFeature/>
      </Menu>
    );
  }

}
