
// Imports
import React, { Component } from 'react'
import { NavLink } from "react-router-dom";
import { Card } from 'antd';

// Project components
import Slideshow from './pictureShowSlide'

// Css files
import './Content.css'


/**
 * Home page in website
 * 
 * @author Charles Breton
 * @returns Home Page
 */
export default class HomePage extends Component {

  componentDidMount() { }

  render() {

    // Card title
    const title = (
      <span>
        <NavLink to="/" exact className="backToEvent">
          HOME
          </NavLink>
      </span>
    );

    // Render component
    return (
      <Card title={title}>
        <Slideshow />

        <div className="content">
          <div className="about_us">
            <h1 className="about_us_title">About Us</h1>
            {/* This is for now and will be change based off Companies Requirement */}
            <p>
              The website allows them to see upcoming events happening in the park and to create their own events. It also allows park management to quickly notify members of new guidelines or notices, as well as having a forum section enabling the users and park management to discuss and interact issues with each other. The Sale & Rent section allows members to sell or buy property in the RV park, and there is a Lost & Found section to help find missing items in the park. Lastly, a Services section which allows members to offer or request different types of services if needs be.
            <br /><br />
              {/* Fusce consectetur pharetra lacus, et dapibus leo consequat sit amet. Phasellus quis nibh rhoncus, maximus eros sit amet, fermentum libero. Vestibulum blandit mi in justo accumsan placerat. Praesent in magna dui. Curabitur sollicitudin mollis orci, nec mollis enim vehicula at. Fusce justo velit, gravida eu convallis sit amet, scelerisque nec dui. Integer volutpat enim eget mollis tincidunt. Duis suscipit fringilla malesuada. */}
            </p>
          </div>
          <div className="contact_us">
            <h1 className="contact_us_title">Contact Information</h1>

            <p className="contact_info">email: contact@gmail.com <br />
                        phone: +1 123-456-7890 <br />
                        admin email: admin.contact@gmail.com
            </p>
          </div>
        </div>
      </Card>
    )
  }
}