// Import dependancies
import React, { useEffect, useState, Fragment } from "react";
import { useHistory, NavLink } from "react-router-dom";
import Moment from 'react-moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
    List, Space, message, Button, Card, Input,
    DatePicker
} from 'antd';

import loading_wheel from '../../../images/loading_wheel.svg'
import no_image_placeholder from '../../../images/no_image_placeholder.jpg'


// API calls
import { getServices, searchService } from '../../../api/apifunction'

// Css files
import 'react-tabs/style/react-tabs.css';


const { Search } = Input;

/**
 * Sale & Rent Component that handles Home Page
 * 
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Sale and Rent Home Page
 */

export default function Home(props) {
    // State of website
    const history = useHistory();

    // Access Token
    const token = localStorage.getItem("access_token");

    // Determine section user are looking at
    const [section, setSection] = useState(1)

    // Data for each section
    const [needed, setNeeded] = useState([]);
    const [offered, setOffered] = useState([]);
    const [currentData, setCurrentData] = useState([])

    // User's search features
    const [name, setName] = useState('');
    const [uId, setUId] = useState('')
    const [subId, setSubId] = useState('')
    const [endTime, setEndTime] = useState('')
    const [startTime, setStartTime] = useState('')

    // Load data with initial load
    useEffect(() => {
        localStorage.setItem("load_files", null)
        localStorage.setItem("load_section", 8);
        localStorage.setItem("upload_type", "image/png, image/jpeg")
        fetchServices();
    }, [])

    // Update data based of search changes
    useEffect(() => {
        fetchServices();
    }, [startTime, endTime, name])

    // Fetch Sale data
    const fetchServices = async () => {
        let response;
        if (name === '' && uId === '' && subId === '' && endTime === '' && startTime === '') {
            response = await getServices();
        } else {
            response = await searchService(name, uId, subId, endTime, startTime);
        }

        // Handle response
        try {
            if (response !== "Network Error") {
                if (response.data.status === "SUCCESS") {
                    if (response.data.data !== null) {
                        setServicesSection(response.data.data);
                    } else {
                        setServicesSection([])
                    }
                } else {
                    message.error(response.data.message);
                }
            }
        } catch (error) { }
    }

    // Filter in between Needed or Offered Services
    const setServicesSection = (data) => {

        let neededList = [];
        let offeredList = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].subcategory.name === "Needed") {
                neededList.push(data[i])
            }
            else if (data[i].subcategory.name === "Offered") {
                offeredList.push(data[i])
            }
        }

        setNeeded(neededList)
        setOffered(offeredList)
    }

    // Handle displaying the icons for each post
    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    // Handle Picture display
    const PictureDisplay = (data) => {
        // Determine if we need to show placeholder image of first image from post
        if (typeof data.data !== 'undefined') {
            return (
                <img
                    width={272}
                    alt="SaleOrRentPlaceholderPicture"
                    src={data.data}  // Change to item.image in the future
                />
            )
        } else {
            return (
                <img src={no_image_placeholder} width={272} className="no_image_placeholder_home_page" alt="no_image_placeholder" />
            )
        }
    }


    // Handle logic behind selecting different sections [Offered / Needed]
    const ServicesSection = (data) => {

        setSection(data.category)

        // Determine which panel to display content
        if (offered !== [] && needed !== []) {
            if (section === 1) {
                setCurrentData(offered)
            } else if (section === 2) {
                setCurrentData(needed)
            }
        }

        // Display each post in section
        if (currentData !== "undefined" && currentData.length !== 0) {
            return (
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                        },
                        pageSize: 6
                    }}

                    dataSource={currentData}
                    renderItem={item => (
                        <List.Item
                            className="forum_posts"
                            // 
                            key={item.title}
                            actions={[
                                <div className="message_button" onClick={() => viewPost(item)} >
                                    <IconText className='view_forum' icon={InfoCircleOutlined} text="View" key={"list-vertical-bell-o"} />
                                </div>,
                            ]}
                            // Display first image in post
                            extra={
                                <PictureDisplay data={item.urls[0]} />
                            }
                        >
                            {/* Brief display of content of post */}
                            <h4>{item.title}</h4>

                            <span>Posted by: {item.creator?.firstName} {item.creator?.lastName} </span> &emsp;
                            <span> Date: {item.createTime}</span> <br />
                            <span>{item.description.substring(0,150)} ...</span><br />
                            {/* {item.details} */}
                        </List.Item>
                    )}
                />
            )
        } else {
            // If no post are found with fetching categories
            return (
                <img src={loading_wheel} className="loading_wheel" alt="loading..." />
            )
        }
    }


    // Handle logic behind viewing a specific post
    const viewPost = (item) => {
        localStorage.setItem("ser_post_id", item.id)
        history.push('/services/detail', item)
    }


    // CHEN CODE
    // const searchPost = () => {
    //     if (endTime < startTime) {
    //         message.error("No available Post!");
    //     } else {

    //     }

    // }

    // Search Feature. Date From logic
    const manageDateTo = (date) => {
        if (date == null) {
            let d = "2999-12-31";
            setEndTime(d);
        } else {
            setEndTime(date.format('YYYY-MM-DD'));
        }
    };

    // Search Feature. Date To logic
    const manageDateFrom = (date) => {
        if (date == null) {
            let d = "1962-01-01";
            console.log(d);
            setStartTime(d);
        } else {
            setStartTime(date.format('YYYY-MM-DD'));
        }
    };

    // Determine if logged in to allow creating a post
    const checkLoggedIn = () => {
        if (token !== null) {
            return true;
        }
        return false;
    }

    // Header of the page and link to go back to main section page
    const title = (
        <Fragment>
            {/* Header title with link */}
            <div>
                <NavLink to="/services" exact className="backToEvent">
                    SERVICES
                </NavLink>
                <h1> {">"} </h1>
            </div>

            {/* Search feature and add forum post */}
            <div className="forum_search_feature">
                <Search className="forum_search_box" size="large" placeholder="Search for service" onSearch={value => setName(value)} />

                <DatePicker className="forum_date_picker_from" size="large" placeholder="From:" onChange={(date) => manageDateFrom(date)} />
                &emsp;
                <DatePicker className="forum_date_picker_to" size="large" placeholder="To:" onChange={(date) => manageDateTo(date)} />

                {/* Button for adding forum post */}
                {checkLoggedIn() ?
                    <Button className="forum_create_post_button" size="large"  type='primary'
                        onClick={() => props.history.push('/services/addupdate')}>
                        <PlusOutlined />
                        Add
                    </Button>
                    : null}
                {/* 
                <Button className="forum_create_post_button" type='primary'
                    onClick={() => props.history.push('/services/addupdate')}>
                    <PlusOutlined />
                     Add
                </Button> */}
            </div>
        </Fragment>
    );

    // Rendering the Services Home Page 
    return (
        <Card title={title}>
            < Tabs >
                <TabList>
                    <Tab><h4>OFFERED</h4></Tab>
                    <Tab><h4>NEEDED</h4></Tab>
                </TabList>

                <TabPanel>
                    <ServicesSection category={1} />
                </TabPanel>
                <TabPanel>
                    <ServicesSection category={2} />
                </TabPanel>

            </Tabs >
        </Card>
    )
}