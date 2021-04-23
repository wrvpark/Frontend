// Import dependancies
import React, { useEffect, useState, Fragment } from "react";
import { useHistory, NavLink } from 'react-router-dom';
import Moment from 'react-moment';
import loading_wheel from '../../../images/loading_wheel.svg'


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {
    List, Space, message, Button, Card, Input,
    DatePicker
} from 'antd';
import { MessageOutlined, BellOutlined, BellFilled, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';

// API calls
import { getForums, searchTheForum } from '../../../api/apifunction'

// Css files
import 'react-tabs/style/react-tabs.css';
import 'antd/dist/antd.css';
import "./home_index.css";


const { Search } = Input;

/**
 * Forum Component that handles Home Page
 * 
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Forum Home Page
 */
export default function Home(props) {
    // State of website
    const history = useHistory();

    // Access Token
    const token = localStorage.getItem("access_token");

    // Determine section user are looking at
    const [section, setSection] = useState(1)

    // All data
    const [forums, setForums] = useState([]);

    // Data for each section
    const [currentTab, setCurrentTab] = useState([])
    const [pmPosts, setPMPosts] = useState([]);
    const [bmPosts, setBMPosts] = useState([]);
    const [mPosts, setMPosts] = useState([]);


    const [subcribed, setSubcribed] = useState(false);

    // User's search features
    const [dateFrom, setDateFrom] = useState(new Date("1962-Jan-01"))
    const [dateTo, setDateTo] = useState(new Date())
    const [search, setSearch] = useState('')

    // Load data with initial load
    useEffect(() => {
        localStorage.setItem("load_files", null)
        localStorage.setItem("load_section", 8);
        localStorage.setItem("upload_type", "")
        fetchForums();
    }, [])

    // Update data based of search changes
    useEffect(() => {
        searchForumPost()
    }, [dateFrom, dateTo, search])

    // Fetch Sale data
    const fetchForums = async () => {

        // FOR SEARCH
        /*let response;
        if(dateFrom == '' && dateTo == '' && search == ''){
            console.log(dateFrom,dateTo, search)
            console.log(123)
            response = await getForums();
        }else{
            console.log(456)
            console.log(dateFrom,dateTo, search)
            response = await searchTheForum();
        } */

        let response = await getForums();
        // Handle response
        try {
            if (response !== "Network Error" && typeof response.data !== 'undefined') {
                if (response.data.status === "SUCCESS" && response.data.data !== null) {
                    setForums(response.data.data)
                    setForumSection(response.data.data);
                } else {
                    message.error(response.data.message);
                }
            }
        } catch (error) { }
    }

    // Handle logic behind selecting different sections [PM / BM / M]
    const setForumSection = (data) => {

        let pmList = [];
        let bmList = [];
        let mList = [];

        // Determine which panel to display content
        for (let i = 0; i < data.length; i++) {
            // console.log(data)
            if (data[i].type === "Member") {
                mList.push(data[i])
            }
            else if (data[i].type === "Board") {
                bmList.push(data[i])
            } else {
                pmList.push(data[i])
            }
        }

        setMPosts(mList)
        setBMPosts(bmList)
        setPMPosts(pmList)
    }




    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    // FOR FUTURE IMPLEMENTATION
    const handleSubcribeClick = (props) => {
        console.log("WORKING")
    }


    // Handle logic behind selecting different sections [BM / PM / M]
    const ForumPost = (data) => {

        setSection(data.category)

        // Determine which panel to display content
        if (section === 1) {
            setCurrentTab(mPosts)
        } else if (section === 2) {
            setCurrentTab(bmPosts)
        } else if (section === 3) {
            setCurrentTab(pmPosts)
        }

        // Display each post in section
        if (currentTab !== null && currentTab.length !== 0) {
            return (
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                        },
                        pageSize: 6
                    }}

                    dataSource={currentTab}
                    renderItem={item => (
                        <List.Item
                            className="forum_posts"
                            // 
                            key={item.title}
                            actions={[
                                <div className="message_button" onClick={() => viewPost(item)} >
                                    <IconText className='view_forum' icon={InfoCircleOutlined} text="View" key={"list-vertical-bell-o"} />
                                </div>,
                                // FOR FUTURE IMPLEMENTATION
                                // <div className="subcribe_button" onClick={() => console.log("WORKING")}>
                                //     {subcribed ?
                                //         <IconText className='subcribed_button' icon={BellFilled} text="Subcribed" key={"list-vertical-bell-o"} />
                                //         : <IconText className="subcribe_button" icon={BellOutlined} text="Subcribe" key={"list-vertical-bell-o"} />
                                //     }
                                //     {/* <IconText className="subcribe_button" icon={BellOutlined} text="Subcribe" key={"list-vertical-bell-o"} /> */}
                                // </div>,
                                <div className="message_button" onClick={() => console.log("WORKING")}>
                                    <IconText icon={MessageOutlined} text={item.responses.length} key="list-vertical-message" />
                                </div>,

                            ]}
                        >
                            {/* Brief display of content of post */}
                            <h4>{item.title}</h4>

                            <span>Posted by: {item.creator?.firstName} {item.creator?.lastName} </span> &emsp;
                            <span> Date: {item.createDate} </span> <br />
                            <span>{item.details}</span><br />
                        </List.Item>
                    )}
                />
            )
        } else {
            // If no post are found with fetching categories
            return (
                <img src={loading_wheel} className="loading_wheel" alt="loading..." />
                // <>No post</>
            )
        }
    }

    // Handle logic behind viewing a specific post
    const viewPost = (item) => {
        localStorage.setItem("forum_post_id", item.id)
        history.push('/forum/detail', item)
    }

    // Search for specific post
    const searchForumPost = () => {

        //load data
        let searchResult = [];
        let index = 0;
        if (dateTo < dateFrom) {
            message.error("No available Post!");
        } else {

            for (let i = 0; i < forums.length; i++) {
                index++;

                let titlePos = forums[i].title.search(search)
                let fullName = forums[i].creator.firstName + " " + forums[i].creator.lastName;
                let creatorPos = fullName.search(search)

                if (titlePos >= 0 || creatorPos >= 0) {
                    let postDate = new Date(forums[i].createDate);

                    if (postDate.getTime() <= dateTo.getTime() && postDate.getTime() >= dateFrom.getTime()) {
                        searchResult.push(forums[i])
                    }

                }
            }
        }

        //postdata
        if (searchResult.length > 0) {
            setForumSection(searchResult)
        } else if (index > 0) {
            setForumSection(searchResult)
            message.error("No available Post!");
        }
        //setForumSection(forums)
    }

    // Search Feature. Date From logic
    const manageDataTo = (date) => {
        if (date == null) {
            let d = new Date();
            setDateTo(d);
        } else {
            setDateTo(date.toDate())
        }
    }

    // Search Feature. Date To logic
    const manageDataFrom = (date) => {
        if (date == null) {
            let d = new Date("1962-Jan-01");
            setDateFrom(d);
        } else {
            setDateFrom(date.toDate())
        }
    }

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
                <NavLink to="/forum" exact className="backToEvent">
                    FORUM
                </NavLink>
                <h1> {">"} </h1>
            </div>

            {/* Search feature and add forum post */}
            <div className="forum_search_feature">
                <Search className="forum_search_box" size="large" placeholder="Search for forum post" onSearch={value => setSearch(value)} />


                <DatePicker className="forum_date_picker_from" size="large" placeholder="From:" onChange={(date) => manageDataFrom(date)} />
                {/* <DatePicker  className="forum_date_picker_to" placeholder="To:" onChange={(date) => setDateTo(date.toDate())} />  */}
                &emsp;
                <DatePicker className="forum_date_picker_to" size="large" placeholder="To:" onChange={(date) => manageDataTo(date)} />

                {/* Button for adding forum post */}
                {checkLoggedIn() ?
                    <Button className="forum_create_post_button" size="large" type='primary'
                        onClick={() => props.history.push('/forum/addupdate')}>
                        <PlusOutlined className="plus_button" />
                        Add
                    </Button>
                    : null}
            </div>
        </Fragment>
    );



    // Rendering the Forum Home Page 
    return (


        <Card title={title}>
            <div>
                < Tabs >
                    <TabList>
                        <Tab><h4>MEMBERS</h4></Tab>
                        <Tab><h4>BOARD MEMBERS</h4></Tab>
                        <Tab><h4>PARK MANAGEMENT</h4></Tab>
                    </TabList>

                    <TabPanel>
                        <ForumPost category={1} />
                    </TabPanel>
                    <TabPanel>
                        <ForumPost category={2} />
                    </TabPanel>
                    <TabPanel>
                        <ForumPost category={3} />
                    </TabPanel>
                </Tabs >
            </div>

        </Card>
    )
}
