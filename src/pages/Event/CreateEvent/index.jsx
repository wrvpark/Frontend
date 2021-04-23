import React, { useEffect, useState, Component } from "react";
import { NavLink } from "react-router-dom";
import "./createEvent.css";
import NotificationBell from "../../../Components/NotificationBell";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import DatePicker from "@bit/nexxtway.react-rainbow.date-picker";
import TimeField from "react-simple-timefield";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import axios from "axios";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { addEvent } from "../../../api/apifunction";
import DisplayEventInfo from "./eventModal";

import {
  searchEventsByCategory,
  eventRetrieval,
  searchEventsBySearch,
  fetchSubCategories,
} from "../../../api/apifunction";


export default class CreateEvent extends Component {
  constructor() {
    super();
    this.state = {
      eventName: "",
      location: "",
      startDate: new Date(),
      startTime: "",
      endDate: new Date(),
      endTime: "",
      description: "",
      fileName: "fileNameForNow.txt",
      recurring: false,
      isLimited: false,
      uId: "",
      locations: [],
      categories: [],
      category: "",
      displayEvent: false,
    };
    this.fetchSubCategories = this.fetchSubCategories.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.ref = React.createRef();

    // this.fetchSubCategories();
  }

  componentDidMount() {
    let currentComponent = this;
    this.fetchSubCategories(currentComponent);
  }

  fetchSubCategories = async (currentComponent) => {
    // console.log("WORKING")
    const event_id = localStorage.getItem("event_cat_id");
    await axios
      .get("http://localhost/api/v1/categories/" + event_id)
      .then(function (response) {
        // handle success
        const responseData = response.data;
        let locations = [];
        let categories = [];
        if (responseData.status === "SUCCESS" && responseData !== null) {
          for (let elem of responseData.data) {
            if (elem.type === "location") {
              locations.push({
                value: elem.id,
                label: elem.name,
                type: elem.type,
              });
            } else {
              categories.push({
                value: elem.id,
                label: elem.name,
                type: elem.type,
              });
            }
          }

          currentComponent.setState({
            locations: locations,
          });

          currentComponent.setState({
            categories: categories,
          });
        } else {
          message.error(responseData.message);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  fetchSubCategoriesCall =  () => {
    console.log(localStorage.getItem("event_cat_id"))
    const response = fetchSubCategories(localStorage.getItem("event_cat_id"));
    console.log(response)
    if (response !== "Network Error" && typeof response.data !== 'undefined') {
      if (response.status === "SUCCESS" && response.data !== null) {
        console.log(response)
        this.handleCategoryType(response.data)
      } else {
        message.error('Error retrieving categories');
      }
    }

  };

  handleCategoryType = (info) => {
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
    this.setState({ locations: locList});
    this.setState({ categories: locList});

    // }

  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post("http://localhost/api/v1/events/", {
        uId: this.state.uId,
        title: this.state.eventName,
        description: this.state.description,
        startTime: this.state.startDate,
        endTime: this.state.endDate,
        fileName: "wqe",
        isLimited: this.state.limited,
        locSubId: this.state.location,
        descSubId: this.state.category,
        isRecurring: this.state.recurring,
      })
      .then(function (response) {
        // handle success
        const responseData = response.data;
        if (responseData.status === "SUCCESS" && responseData !== null) {
          window.alert("Event Added Successfuly")
          this.showSuccessModal(responseData);
          console.log(responseData.message)
        } else {
          message.error(responseData.message);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  showSuccessModal = (responseData) => {
    
  };

  handleChange = (e) => {
    try {
      if (e.target.type === "checkbox") {
        this.setState({
          [e.target.id]: e.target.checked,
        });
      } else {
        this.setState({
          [e.target.id]: e.target.value,
        });
        console.log(e.target.id);
      }
    } catch {
      if (e.type === "description") {
        this.setState({
          category: e.value,
        });
      } else {
        this.setState({
          [e.type]: e.value,
        });
      }
      console.log(e.type, e.value, e.label);
    }
  };

  render() {
    const fileProps = {
      name: "files",
      multiple: true,
      action: "http://localhost:80/api/v1/files",
      onChange(info) {
        const { status } = info.file;
        if (status === "done") {
          const fileNames = info.file.response.data;
          console.log(fileNames);
          // this.setState({ fileName: fileNames[0] });
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div>
        <div className="top">
          <NavLink to="/event" exact className="backToEvent">
            EVENT
          </NavLink>
          <h1> {">"} </h1>
          <NavLink to="/event/create" exact className="currPage">
            EVENT CREATION
          </NavLink>

          <NotificationBell />
        </div>
        <div className="forms">
          <Form onSubmit={this.handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6">
                <Form.Control
                  placeholder="EVENT NAME"
                  className="eventName"
                  id="eventName"
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="3">
                <Select
                  placeholder="Location"
                  options={this.state.locations}
                  id="location"
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="3">
                <Select
                  placeholder="Category"
                  options={this.state.categories}
                  id="category"
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="3" className="startDateGroup">
                <Form.Label>start date</Form.Label>
                <DatePicker
                  formatStyle="medium"
                  value={this.state.startDate}
                  onChange={(value) => this.setState({ startDate: value })}
                  className="startDate"
                />
              </Form.Group>

              <Form.Group as={Col} md="1" className="startTimeGroup">
                <Form.Label>start time</Form.Label>
                <TimeField
                  onChange={this.handleChange}
                  className="startTime"
                  id="startTime"
                />
              </Form.Group>
              <Form.Group as={Col} md="3" className="endDateGroup">
                <Form.Label>end date</Form.Label>
                <DatePicker
                  formatStyle="medium"
                  value={this.state.endDate}
                  onChange={(value) => this.setState({ endDate: value })}
                  className="endDate"
                />
              </Form.Group>

              <Form.Group as={Col} md="1">
                <Form.Label>end time</Form.Label>
                <TimeField
                  onChange={this.handleChange}
                  className="endTime"
                  id="endTime"
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group className="descriptionGroup">
                <Form.Control
                  as="textarea"
                  rows="7"
                  fluid
                  placeholder="Description"
                  className="description"
                  id="description"
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row >
              <div className="file_uploading">
              <Upload {...fileProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Upload>
              </div>
            </Form.Row>

            {/* <Form.Row>
              <Form.Group className="recurringGroup">
                <Form.Check
                  className="recurring"
                  type="checkbox"
                  label="recurring"
                  id="recurring"
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group className="limitedGroup">
                <Form.Check
                  type="checkbox"
                  label="limited"
                  className="limited"
                  id="limited"
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row> */}

            <Form.Row>
              <Button type="submit" className="submitBtn">
                CREATE
              </Button>
            </Form.Row>
          </Form>
        </div>
      </div>
    );
  }
}
