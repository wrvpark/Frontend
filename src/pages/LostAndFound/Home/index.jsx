import React, { useEffect, useState, Fragment } from "react";
import { useHistory, NavLink } from "react-router-dom";
import loading_wheel from '../../../images/loading_wheel.svg'

import {
  getLostAndFound,
  searchLostAndFoundItems,
} from "../../../api/apifunction";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Card, Input, DatePicker, List, Space, message, Button } from "antd";
import no_image_placeholder from '../../../images/no_image_placeholder.jpg'


import {
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "react-tabs/style/react-tabs.css";

const { Search } = Input;



/**
 * Lost & Found Component that handles Home Page
 * 
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Lost & Found Home Page
 */

export default function Home(props) {
  // State of website
  const history = useHistory();

  // Access Token
  const token = localStorage.getItem("access_token");

  // Determine section user are looking at
  const [section, setSection] = useState(1);

  // Data for each section
  const [currentData, setCurrentData] = useState([]);
  const [lostData, setLostData] = useState([]);
  const [foundData, setFoundData] = useState([]);

  // User's search features
  const [name, setName] = useState("");
  const [uId, setId] = useState("");
  const [subId, setSubId] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTime, setStartTime] = useState("");


  // Load data with initial load
  useEffect(() => {
    localStorage.setItem("load_files", null);
    localStorage.setItem("upload_type", "image/png, image/jpeg")
    fetchLostAndFounds();
  }, []);

  // Update data based of search changes
  useEffect(() => {
    fetchLostAndFounds();
  }, [startTime, endTime, name]);


  // Fetch Lost & Found data
  const fetchLostAndFounds = async () => {
    let response;

    // Determine type of fetch we need
    if (
      name === "" &&
      uId === "" &&
      subId === "" &&
      endTime === "" &&
      startTime === ""
    ) {
      response = await getLostAndFound();
    } else {
      response = await searchLostAndFoundItems(
        name, subId, endTime, startTime, uId
      );
    }

    // Handle response
    try {
      if (response !== "Network Error" && response.length !== 0) {
        if (response.data.status === "SUCCESS") {
          if (response.data.data !== null) {
            formatData(response.data.data);
          }
        } else {
          message.error(response.data.message);
        }
      }
    } catch (error) { }
  }

  // Format data for drop-down menu
  const formatData = (data) => {
    let lostList = [];
    let foundList = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].subcategory.name === "Lost") {
        lostList.push(data[i]);
      } else if (data[i].subcategory.name === "Found") {
        foundList.push(data[i]);
      }
    }

    setLostData(lostList);
    setFoundData(foundList);
  };

  // Handle displaying the icons for each post
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  // Handle logic behind selecting different sections [Lost / Found]
  const LostFoundSection = (data) => {
    // Determine which category we want to display
    setSection(data.category);

    // Determine which panel to display content
    if (lostData !== [] && foundData !== []) {
      if (section === 1) {
        setCurrentData(lostData);
      } else if (section === 2) {
        setCurrentData(foundData);
      }
    }

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

    // Display each post in section
    if (currentData !== "undefined" && currentData.length !== 0) {
      return (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {

            },
            pageSize: 6,
          }}
          dataSource={currentData}
          renderItem={(item) => (
            <List.Item
              className="forum_posts"
              key={item.title}
              actions={[
                <div className="message_button" onClick={() => viewPost(item)}>
                  <IconText
                    className="view_forum"
                    icon={InfoCircleOutlined}
                    text="View"
                    key={"list-vertical-bell-o"}
                  />
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
              <span>{item.description.substring(0,150)} ...</span>
            </List.Item>
          )}
        />
      );
    } else {
      // If no post are found with fetching categories
      return (
        <img src={loading_wheel} className="loading_wheel" alt="loading..." />
      )
    }
  };

  // Handle logic behind viewing a specific post
  const viewPost = (item) => {
    localStorage.setItem("laf_post_id", item.id);
    history.push("/lostAndFound/detail", item);
  };

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
  };

  // Header of the page and link to go back to main section page
  const title = (
    <Fragment>
      {/* Header title with link */}
      <div>
        <NavLink to="/lostAndFound" exact className="backToEvent">
          LOST & FOUND
        </NavLink>
        <h1> {">"} </h1>
      </div>
      <br/>
      {/* Search feature and add forum post */}
      <div>
        
        <Search
          className="forum_search_box"
          size="large"
          placeholder="Search for service"
          onSearch={(value) => setName(value)}
        />

        {/* Search feature and add forum post */}
        <DatePicker
          className="forum_date_picker_from"
          size="large"
          placeholder="From:"
          onChange={(date) => manageDateFrom(date)}
        />
        &emsp;
        <DatePicker
          className="forum_date_picker_to"
          size="large"
          placeholder="To:"
          onChange={(date) => manageDateTo(date)}
        />

        {/* Button for adding forum post */}
        {checkLoggedIn() ? (
          <Button
            className="forum_create_post_button"
            size="large"
            type="primary"
            onClick={() => props.history.push("/lostAndFound/addupdate")}
          >
            <PlusOutlined />
            Add
          </Button>
        ) : null}
      </div>
    </Fragment>
  );

  // Rendering the Sale and Rent Home Page 
  return (
    <Card title={title}>
      <div>
        <Tabs>
          <TabList>
            <Tab><h4>LOST</h4></Tab>
            <Tab><h4>FOUND</h4></Tab>
          </TabList>

          <TabPanel>
            <LostFoundSection category={1} />
          </TabPanel>
          <TabPanel>
            <LostFoundSection category={2} />
          </TabPanel>
        </Tabs>
      </div>
    </Card>
  );
}
