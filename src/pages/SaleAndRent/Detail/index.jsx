// Import dependancies
import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, List, message, Button, Modal } from "antd";
import Moment from "react-moment";
import Form from "react-bootstrap/Form";

// Project imports
import ContactSeller from "./contactSeller";
import Slideshow from "./showPictures";

// API calls
import {
  getSaleOrRentPostInfo,
  deleteSaleAndRent,
} from "../../../api/apifunction";

// Css files
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "./detail_page.css";


const Item = List.Item;

/**
 * Sale & Rent Component that handles viewing a post
 *
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Sale and Rent Detail Page
 */
export default function Detail(props) {
  // Access Token
  const token = localStorage.getItem("access_token");

  // Post info
  const [postInfo, setPostInfo] = useState([]);
  const itemId = localStorage.getItem("sar_post_id");

  // Modal logics
  const [showModal, setShowModal] = useState(false);
  const [creator, setCreator] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  var isAdmin = false;

  // Fetch Post info based off id
  useEffect(() => {
    fetchPostInfo();
  }, []);

  // Fetch function call to get post info
  const fetchPostInfo = async () => {
    const response = await getSaleOrRentPostInfo(itemId);
    try {
      if (response !== "Network Error") {
        if (response.data.status === "SUCCESS" && response.data.data !== null) {
          setPostInfo(response.data.data);
          setCreator(postInfo.creator)
          localStorage.setItem("load_files", JSON.stringify(response.data.data.image));
        } else {
          message.error("Fetching wasn't successfull");
        }
      } else {
        message.error("Error with connecting to backend");
      }
    } catch (error) { }
  };

  // Contact Seller Modal showup
  const contactSeller = () => {
    setShowModal(true);
  };

  // Handle closing confirmation modal
  const onCloseWindow = () => {
    setShowModal(false);
  };

  // Prevent redirect when clicking on Post Details header
  const handleClick = (e) => {
    e.preventDefault();
  };


  // Check for permission to modify or delete post
  const checkAccountPermission = () => {
    if (token !== null) {
      const token_info = JSON.parse(localStorage.getItem("session_details"));
      for (let i = 0; i < token_info.realm_access.roles.length; i++) {
        if (token_info.realm_access.roles[i] === "admin") {
          isAdmin = true;
          return true;
        }
      }
      if (token_info.sub === postInfo.creator?.id) {
        return true;
      }
    }
  };

  // Handle logic behind delete a post ** NEEDS SOME WORK **
  const deletePost = async () => {
    //if it is admin, then show the modal to get the reason
    if (isAdmin) {
      setIsModalVisible(true);
    } else {
      deleteItem();
    }
  };

  // API call to delete item
  const deleteItem = async () => {
    const tokenInfo = JSON.parse(localStorage.getItem("session_details"));
    const modifierId = tokenInfo.sub;
    const description = "";
    const response = await deleteSaleAndRent(
      itemId,
      modifierId,
      description,
      reason
    );
    try {
      if (response !== "Network Error" && response.status !== 401) {
        if (response.data.status === "SUCCESS") {
          props.history.push("/saleAndRent");
        } else {
          message.error(response.data.message);
        }
      } else {
        message.error(response.data.message);
      }
    } catch (error) { }
  };

  //get the reason and then close it
  const handleOk = () => {
    setIsModalVisible(false);
    deleteItem();
  };
  //close it
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Header of the page and link to go back to main section page
  const title = (
    <Fragment>
      <div>
        <NavLink to="/saleAndRent" exact className="backToEvent">
          SALE & RENT
        </NavLink>
        <h1> {">"} </h1>
        <NavLink
          to="/saleAndRent/detail"
          onClick={handleClick}
          exact
          className="currPage"
        >
          POST DETAILS
        </NavLink>
      </div>

      {/* Determine if user has permission to update or delete post */}
      <div>
        {checkAccountPermission() ? (
          <div>
            <br />
            <h2>PERMISSIONS</h2>
            <Button
              type="button"
              className="checkBtn"
              onClick={() =>
                props.history.push("/saleAndRent/addUpdate", postInfo)
              }
            >
              UPDATE
              </Button>
              &emsp;
            <Button type="button" className="checkBtn" onClick={() => deletePost()}>
              DELETE
              </Button>
          </div>
        ) : null}
      </div>

    </Fragment>
  );


  // Render component
  return (
    <Card title={title}>
      {/* Display Contact Seller Modal */}
      {showModal ? (

        <ContactSeller
          onCloseWindow={onCloseWindow}
          user={creator}
          post={postInfo}
        />
      ) : null}

      <Slideshow images={postInfo.urls} />

      <Form.Row className="first_row">


        <Form.Group className="col-md-8">
        </Form.Group>

        <Form.Group className="item col-md-4">
          <span className='date_format'>Date: {postInfo.createTime}</span>
        </Form.Group>

      </Form.Row>

      <Item>
        <div className="left">
          <h4>Title: {postInfo.title}</h4>
        </div>
        <div className="right">
          <h5>Category: {postInfo.subcategory?.name}</h5>
        </div>

      </Item>

      <Item className="third_row">
        <Item>
          <div className="price_box">
            <h6>Price: ${postInfo.price}</h6>
          </div>

          <div className="right">
            <h6>Lot Number: {postInfo.lotNo}</h6>
          </div>
        </Item>
        <Item>
          <div className="left">
            <span>Creator: </span>
            <span>{postInfo.creator?.firstName} {postInfo.creator?.lastName}</span>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => contactSeller()}
              className="checkBtn"
            >
              CONTACT SELLER
          </Button>
          </div>


        </Item>
      </Item>

      <Item>
        <div className="description_box">
          <h5 className="r3_description_title">Description: </h5>

          <h6 className="r3_description_content">{postInfo.description}</h6>
        </div>
      </Item>


      <Modal
        title="Delete this item"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Reason to delete:
        <input
          placeholder="del"
          name="reason"
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </Card >
  );
}
