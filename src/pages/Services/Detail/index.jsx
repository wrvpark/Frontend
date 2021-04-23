// Imports
import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, List, Modal, message, Button } from 'antd';
import Moment from 'react-moment';
import Form from "react-bootstrap/Form";

// Project imports
import ContactSeller from './contactSeller'
import Slideshow from "./showPictures";

// API calls
import { getServicesPostInfo, deleteServices } from '../../../api/apifunction'

// Css files
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './detail_page.css';

const Item = List.Item;

/**
 * Services Component that handles viewing a post
 *
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Services Detail Page
 */
export default function Detail(props) {
    // Access Token
    const token = localStorage.getItem("access_token");

    // Post info
    const [postInfo, setPostInfo] = useState([]);
    const [itemId, setitemId] = useState(localStorage.getItem("ser_post_id"));

    // Modal logics
    const [showModal, setShowModal] = useState(false);
    const [creator, setCreator] = useState(postInfo.creator);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [reason, setReason] = useState("");
    var isAdmin = false;

    // Fetch Post info based off id
    useEffect(() => {
        fetchPostInfo()
    }, [])

    // Fetch function call to get post info
    const fetchPostInfo = async () => {
        const response = await getServicesPostInfo(itemId)
        try {
            if (response !== "Network Error") {
                if (response.data.status === "SUCCESS" && response.data.data !== null) {
                    setPostInfo(response.data.data)
                    localStorage.setItem("load_files", JSON.stringify(response.data.data.image));
                } else {
                    message.error("Fetching wasn't successfull")
                }
            } else {
                message.error("Error with connecting to backend")
            }
        } catch (error) { }

    }

    // Handle closing confirmation modal
    const onCloseWindow = () => {
        setShowModal(false);
    };


    // Prevent redirect when clicking on Post Details header
    const handleClick = (e) => {
        e.preventDefault()
    }

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
        return false;
    }

    // Handle logic behind delete a post ** NEEDS SOME WORK **
    const deletePost = () => {
        //if it is admin, then show the modal to get the reason
        if (isAdmin) {
            setIsDeleteModalVisible(true);
        }
        else {
            deleteItem();
        }
    }

    // API call to delete item
    const deleteItem = async () => {
        const tokenInfo = JSON.parse(localStorage.getItem("session_details"));
        const modifierId = tokenInfo.sub;
        const description = "";
        const response = await deleteServices(itemId, modifierId, description, reason);
        if (response !== "Network Error" && response.status !== 401) {
            if (response.data.status === "SUCCESS") {
                props.history.push('/services');
            } else {
                message.error(response.data.message)
            }
        } else {
            message.error(response.data.message)
        }
    }

    //get the reason and then close it
    const handleOk = () => {
        setIsDeleteModalVisible(false);
        deleteItem();
    };

    //close it
    const handleCancel = () => {
        setIsDeleteModalVisible(false);
    };

    // Header of the page and link to go back to main section page
    const title = (
        <Fragment>
            <div>
                <NavLink to="/services" exact className="backToEvent">
                    SERVICES
                </NavLink>
                <h1> {">"} </h1>
                <NavLink to="/services/detail" onClick={handleClick} exact className="currPage">
                    POST DETAILS
                </NavLink>
            </div>

            {/* Determine if user has permission to update or delete post */}
            <div>
                {checkAccountPermission() ? (
                    <div>
                        <br/>
                        <h2>PERMISSIONS</h2>
                        <Button
                            type="button"
                            className="checkBtn"
                            onClick={() =>
                                props.history.push("/services/addUpdate", postInfo)
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
            {showModal ?
                <ContactSeller onCloseWindow={onCloseWindow} user={creator} post={postInfo} />
                : null
            }
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
                        <Button type="button" onClick={() => setShowModal(true)} className="checkBtn">
                            CONTACT CREATOR
                        </Button>
                    </div>


                </Item>
            </Item>

            <Item>
                <div className="services_description_box">
                    <h5 className="r3_description_title">Description: </h5>

                    <h6 className="r3_description_content">{postInfo.description}</h6>
                </div>
            </Item>

          
            <Modal title="Delete this item"
                visible={isDeleteModalVisible}
                onOk={handleOk}
                onCancel={handleCancel} >

                Reason to delete:
                <input placeholder="del" name="reason"
                    onChange={(e) => setReason(e.target.value)} />
            </Modal>
        </Card >
    );
}