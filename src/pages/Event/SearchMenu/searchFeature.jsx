import React, { useEffect, useState, Fragment } from "react";
import { Card, Table, Button, Input, message } from "antd";
import axios from "axios";
import Select from "react-select";

// Project functions
import DisplayEventInfo from "../viewEvent";

// API calls
import {
  searchEventsByCategory,
  eventRetrieval,
  searchEventsBySearch,
  fetchSubCategories,
} from "../../../api/apifunction";

const { Search } = Input;


// 
/**
 * Function in charge of loading element inside action menu, which will display a search functionality and as well 
 * display the events based off search
 * @author Charles Breton
 * @returns Search feature in event action menu
 */
export default function SearchFunction() {

  const [initialLoad, setInitialLoad] = useState(false);
  // initilize events. track of events based of search
  const [events, setEvents] = useState([]);

  // initilize subcategory state
  const [subCategories, setSubCategories] = useState([]);

  // initilize the different categories to select from
  const [descCategories, setDescCatogories] = useState([]);
  const [locCategories, setLocCatogories] = useState([]);

  //define table columns
  const [columns, setColumns] = useState([]);

  // state for showing event detail modal and the content to display
  const [showView, setShowView] = useState(false);
  const [displayEvent, setDisplayEvent] = useState();

  // initilize search input. input to search for specific event
  const [param, setParam] = useState("");
  // initilize sub selection. select to retrieve certain subcategory data
  const [descId, setDescId] = useState("");
  const [locId, setLocId] = useState("");



  // Initial Retrieval for loading component
  useEffect(() => {

    if (!initialLoad) {
      // Retrieve events
      fetchEvents();

      // Initialize table column
      initializeColumns();

      // Retrieve categories for search function
      fetchSubCategoriesCall();
    }
  }, []);

  // Update view when state changes
  useEffect(() => {
    // Fetch event based of param
    if (initialLoad) {
      fetchEvents();
    } else {
      setInitialLoad(true)

    }
  }, [param, descId, locId]);

  // Get events based of param
  const fetchEvents = async () => {
    let response;

    // Retrieve initial events or when its empty
    if (param === "" && descId === "" && locId === "") {
      response = await eventRetrieval();
    }
    // Retrieve events based of search input
    else if (param !== "" && descId === "" && locId === "") {
      response = await searchEventsBySearch(param);
      if (response.status === "SUCCESS" && response.data !== null) {
        setEvents(response.data)
        return
      } else {
        setEvents('')
        return
      }
    }



    // Retrieve events based of categories selection
    else if ((param === "" && descId !== "") || locId !== "") {
      response = await searchEventsByCategory(locId, descId);
    }
    // Retrieve events based off both
    else {
      const resultA = await searchEventsByCategory(locId, descId);
      const resultB = await searchEventsBySearch(param);

      let resultAData = null;
      let resultBData = null;

      if (resultB.status === "SUCCESS" && resultB.data !== null && resultA.data.status === "SUCCESS" && resultA.data.data !== null) {
        resultAData = resultA.data.data
        resultBData = resultB.data
      } else {
        setEvents(null);
      }

      if (resultAData !== null && resultBData !== null) {
        const filteredEvents = resultAData.filter(value => resultBData.includes(value))
        setEvents(filteredEvents);
      } else {
        setEvents(null);
      }
      return
    }

    const responseData = response.data;
    //if there is data, store it in the state
    if (response !== "Network Error"  && typeof response.data !== 'undefined') {
      if (responseData.status === "SUCCESS" && responseData.data !== null) {
        setEvents(responseData.data);
      }
      //fails, just display the error message
      else {
        setEvents(null)
        // message.error("responseData.message");
      }
    }
  };

  // Fetch sub-categories for event
  const fetchSubCategoriesCall = async () => {
    const response = await fetchSubCategories(localStorage.getItem("event_cat_id"));
    if (response !== "Network Error" && typeof response.data !== 'undefined') {
      if (response.status === "SUCCESS" && response.data !== null) {
        setSubCategories(response.data);
        handleCategoryType(response.data)
      } else {
        message.error('Error retrieving categories');
      }
    }

  };

  const handleCategoryType = (info) => {
    // Check if we receive any categories
    // if (info !== null) {
    // Setup initial default value
    let locList = [{ value: "", label: "Location" }];
    let descList = [{ value: "", label: "Categories" }];

    // Go through list and determine which goes where
    for (let i = 0; i < info.length; i++) {
      if (info[i].type === "location") {
        let object = {
          value: info[i].id,
          label: info[i].name,
        };
        locList.push(object);
      } else {
        let object = {
          value: info[i].id,
          label: info[i].name,
        };
        descList.push(object);
      }
    }
    setLocCatogories(locList);
    setDescCatogories(descList);
  }


  const handleViewEvent = (event) => {
    setShowView(true)
    setDisplayEvent(event)
  };

  const onCloseWindow = () => {
    setShowView(false);
  };

  function initializeColumns() {
    // Render for columns
    const columns = [
      {
        title: "Title",
        width: 200,
        dataIndex: "title",
        key: "title",
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (event) =>
          <Fragment>
            <Button type="primary" onClick={() => handleViewEvent(event)} size='10'>View</Button>
          </Fragment>
      }
    ];
    setColumns(columns);
  }


  // Load header contains search features
  const title = (
    <Fragment>
      <h4>
        <b className="seach_title">Search</b>
      </h4>
      <Search
        className="search"
        placeholder="Search for event"
        style={{ width: "100%" }}
        onSearch={(value) => { setParam(value) }}
      />
      <br />
      {/* display the sub-categories for the Park Document  */}
      <Select
        className='drop_down_desc'
        placeholder="Categories"
        style={{ width: "100%", paddingTop: 10 }}
        options={descCategories}
        onChange={(value) => setDescId(value.value)}
      />
      <br />
      <Select
        className='drop_down_loc'
        placeholder="Location"
        style={{ width: "100%", paddingTop: 5 }}
        options={locCategories}
        onChange={(value) => setLocId(value.value)}
      />
    </Fragment>
  );

  // Render for component
  return (
    <Card title={title}>
      <h4>
        <b>Events</b>
      </h4>
      {/* Show Event Info only if you press on View element */}
      {showView ?
        <DisplayEventInfo onCloseWindow={onCloseWindow} displayEvent={displayEvent} />
        : null
      }
      <Table
        bordered
        rowKey="id"
        pagination={{ pageSize: 5, alignment: "center" }}
        // //set the table column names
        columns={columns}
        //load the events
        dataSource={events}
      ></Table>
    </Card>
  );
}
