// Import dependancies
import React, { useEffect, useState, Fragment } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Moment from 'react-moment';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Card, Input, DatePicker, Space, message, List, Button } from 'antd'
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import loading_wheel from '../../../images/loading_wheel.svg'

import no_image_placeholder from '../../../images/no_image_placeholder.jpg'

// API calls
import { getSale, getRent, searchSaleRentItems } from '../../../api/apifunction'

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
    const [rent, setRent] = useState([]);
    const [sale, setSale] = useState([]);
    const [currentData, setCurrentData] = useState([])

    // CHEN OLD CODE
    //const [dateFrom, setDateFrom] = useState(new Date("1962-Jan-01"))
    //const [dateTo, setDateTo] = useState(new Date())
    //const [search , setSearch] = useState('')

    // FOR FUTURE IMPLEMENTATION
    // const [subcribed, setSubcribed] = useState(false);

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
        fetchSale();
        fetchRent();
    }, [])

    // Update data based of search changes
    useEffect(() => {
        fetchSale();
        fetchRent();
    }, [startTime, endTime, name])


    // Fetch Sale data
    const fetchSale = async () => {
        let response;
        if (name === '' && uId === '' && subId === '' && endTime === '' && startTime === '') {
            response = await getSale();
        } else {
            response = await searchSaleRentItems(name, subId, endTime, startTime, uId);
        }

        // Handle response
        try {
            if (response !== "Network Error" && typeof response.data !== 'undefined') {
                if (response.data.status === "SUCCESS") {
                    if (response.data.data !== null) {
                        setSale(response.data.data)
                    } else {
                        setSale([])
                    }
                } else {
                    message.error(response.data.message);
                }
            }
        } catch (error) { }

    }

    // Fetch Rent data
    const fetchRent = async () => {
        let response;
        if (name === '' && uId === '' && subId === '' && endTime === '' && startTime === '') {
            response = await getRent();
        } else {
            response = await searchSaleRentItems(name, uId, subId, endTime, startTime);
        }

        // Handle response
        try {
            if (response !== "Network Error" && typeof response.data !== 'undefined') {
                if (response.data.status === "SUCCESS") {
                    if (response.data.data !== null) {
                        setRent(response.data.data)
                    } else {
                        setRent([])
                    }
                } else {
                    message.error(response.data.message);
                }
            }
        } catch (error) { }


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

    // Handle logic behind selecting different sections [Sale / Rent]
    const SaleRentSection = (data) => {
        // Determine which panel to display content
        if (rent !== [] && sale !== []) {
            if (data.category === 1) {
                setCurrentData(sale)
            } else if (data.category === 2) {
                setCurrentData(rent)
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
                            <span>
                                {" "}
                                Date:{" "}
                                {item.createTime}
                            </span>{" "}
                            <br />
                            <span>
                                Lot Number: {item.lotNo}
                            </span>
                            <br />
                              <span>
                               Price: ${item.price}
                            </span>
                             <br />
                            <span>{item.description.substring(0,150)} ...</span><br />
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
        localStorage.setItem("sar_post_id", item.id)
        history.push('/saleAndRent/detail', item)
    }

    // CHEN CODE
    /*const searchPost = () => {
         //load data
         let searchRent = [];
         let searchSale = [];
         let index = 0;

         //search data
         if(dateTo < dateFrom){
             message.error("No available Post!");
         }else if(search != ''){
            

             
             for(let i = 0; i < sale.length; i++){
                 index++;
                 let titlePos = sale[i].title.search(search)
                 let createrPos = sale[i].title.search(search)

                 if(titlePos >= 0 || createrPos >= 0){
                     let postDate = new Date(sale[i].createDate);

                     if(postDate.getTime() <= dateTo.getTime() && postDate.getTime() >= dateFrom.getTime()){
                         searchSale.push(sale[i]) 
                         console.log(search)
                     }   
                 }
             }
             for(let i = 0; i < rent.length; i++){
                index++;
                let titlePos = rent[i].title.search(search)
                let creatorPos = rent[i].creator.name.search(search)

                if(titlePos >= 0 || creatorPos >= 0){
                    let postDate = new Date(rent[i].createTime);
                    if(postDate.getTime() <= dateTo.getTime() && postDate.getTime() >= dateFrom.getTime()){
                        searchRent.push(rent[i]) 
                    }   
                }
            }
         }else{

            for(let i = 0; i < sale.length; i++){
                index++;
                    let postDate = new Date(sale[i].createDate);
                    if(postDate.getTime() <= dateTo.getTime() && postDate.getTime() >= dateFrom.getTime()){
                        searchSale.push(sale[i]) 
                    }   
            }
            for(let i = 0; i < rent.length; i++){
                   let postDate = new Date(rent[i].createTime);
                   //console.log(postDate)
                   //console.log(postDate.getTime())
                   //console.log(dateTo.getTime())
                   if(postDate.getTime() <= dateTo.getTime() && postDate.getTime() >= dateFrom.getTime()){
                        console.log(123)
                        searchRent.push(rent[i]) 
                   }   
           }
         }
         //console.log(dateTo)
         //console.log(dateFrom)
         //console.log(searchRent.length )
         //postdata
         setSale(searchSale);
         setRent(searchRent);

         if(searchRent.length == 0 && searchSale.length == 0 && index > 0){
                message.error("No available Post!");
         }

    }*/

    // Search Feature. Date From logic
    const manageDateTo = (date) => {
        if (date == null) {
            let d = "2999-12-31";
            console.log(d)
            setEndTime(d);
        } else {
            setEndTime(date.format('YYYY-MM-DD'));
        }
    };

    // Search Feature. Date To logic
    const manageDateFrom = (date) => {
        if (date === null) {
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

                <NavLink to="/saleAndRent" exact className="backToEvent">
                    SALE & RENT
                </NavLink>
                <h1> {">"} </h1>
                {/* </div> */}
            </div>
            <div>
                {/* Search feature and add forum post */}
                {/* <div className="forum_search_feature"> */}
                {/* Search Feature */}
                <br/>
                <Search className="forum_search_box" size="large" placeholder="Search for post" onSearch={value => setName(value)} />

                {/* Date Picker From / To */}
                <DatePicker className="forum_date_picker_from" size="large" placeholder="From:" onChange={(date) => manageDateFrom(date)} />
                &emsp;
                <DatePicker className="forum_date_picker_to" size="large"s placeholder="To:" onChange={(date) => manageDateTo(date)} />


                {/* </div> */}
                {/* Button for adding forum post */}
                {checkLoggedIn() ?
                    <Button className="forum_create_post_button" size="large" type="primary"

                        onClick={() => props.history.push('/saleAndRent/addupdate')}>
                        <PlusOutlined />
                        Add
                    </Button>
                    : null}
            </div>
        </Fragment >
    );

    // Rendering the Sale and Rent Home Page 
    return (
        <Card title={title}>
            < Tabs >
                <TabList>
                    <Tab><h4>SALE</h4></Tab>
                    <Tab><h4>RENT</h4></Tab>
                </TabList>

                <TabPanel>
                    <SaleRentSection category={1} />
                </TabPanel>
                <TabPanel>
                    <SaleRentSection category={2} />
                </TabPanel>

            </Tabs >
        </Card>
    )
}