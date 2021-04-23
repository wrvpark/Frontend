
// NEED TO FINISH THIS IN FUTURE IMPLEMENTATION

import { useEffect, useState, Fragment } from "react";
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { getServices, searchService } from '../../../api/apifunction'
import React from 'react';
import { NavLink } from "react-router-dom";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import {
    Card, Input,
    DatePicker
} from 'antd'

import { List, Space, message, Button } from 'antd';
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons';


const { Search } = Input;
// const Option = Select.Option;

/**
 * Settings Component that handles Home Page
 * 
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Settings Home Page
 */
export default function UserInfo(props) {

     // Header of the page and link to go back to main section page
     const title = (
        <Fragment>
            {/* Header title with link */}
            <div>
                <NavLink to="/services" exact className="backToEvent">
                    SETTING  
                </NavLink>
                <h1> {">"} </h1>
            </div>
        </Fragment>
    );

    // Render component
    return (
        <Card title={title}>
            < Tabs >
                    <TabList>
                        <Tab><h4>PROFILE INFO</h4></Tab>
                        <Tab><h4>NOTIFICATIONS SETTINGS</h4></Tab>
                    </TabList>
                    <br/>
                    <h1>COMING SOON</h1>
                    <TabPanel>
                        {/* <ServicesSection category={1} /> */}
                    </TabPanel>
                    <TabPanel>
                        {/* <ServicesSection category={2} /> */}
                    </TabPanel>

                </Tabs >
        </Card>
    )
}