
// Import dependancies
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { message, Button, Card, List, Modal } from 'antd';
import Moment from 'react-moment';
import Form from "react-bootstrap/Form";

// Project imports
import ContactSeller from './contactSeller'
import Slideshow from "./showPictures";

// API calls
import { getLostAndFoundPostInfo, deleteLostAndFound } from '../../../api/apifunction'

// Css files
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import "./detail_page.css";


const Item = List.Item;

/**
 * Lost & Found Component that handles viewing a post
 *
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Lost & Found Detail Page
 */
export default function Detail(props) {
    // Access Token
    const token = localStorage.getItem("access_token");

    // Post info
    const [id, setId] = useState(localStorage.getItem("laf_post_id"));
    const [postInfo, setPostInfo] = useState([]);

    // Contact Seller modal
    const [showModal, setShowModal] = useState(false);
    const [creator, setCreator] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [reason, setReason] = useState("");
    var isAdmin = false;

    // Fetch Post info based off id
    useEffect(() => {
        fetchPostInfo();
    }, [])

    // Fetch function call to get post info
    const fetchPostInfo = async () => {
        const response = await getLostAndFoundPostInfo(id)
        try {
            if (response !== "Network Error") {
                if (response.data.status === "SUCCESS" && response.data.data !== null) {
                    setPostInfo(response.data.data)
                    setCreator(postInfo.creator)
                    localStorage.setItem("load_files", JSON.stringify(response.data.data.image))
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

    //delete this lost/found item
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

        const response = await deleteLostAndFound(postInfo.id, description, reason, modifierId);
        try {
            if (response !== "Network Error" && response.status !== 401) {
                if (response.data.status === "SUCCESS") {
                    props.history.push('/lostAndFound');
                } else {
                    message.error(response.data.message)
                }
            } else {
                message.error(response.data.message)
            }
        } catch (error) { }
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
                <NavLink to="/lostAndFound" exact className="backToEvent">
                    LOST & FOUND
                </NavLink>
                <h1> {">"} </h1>
                <NavLink to="/lostAndFound/detail" onClick={handleClick} exact className="currPage">
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
                                props.history.push("/lostAndFound/addUpdate", postInfo)
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
            {/* NEED TO IMPLEMENT */}
            <Slideshow images={postInfo.urls} />

            <Form.Row className="first_row">


                <Form.Group className="col-md-8">

                    <div className="creator_box">

                        <span>Creator: </span>
                        <span>{postInfo.creator?.firstName} {postInfo.creator?.lastName}</span>
                        &emsp;
                        <Button type="button" onClick={() => setShowModal(true)} className="checkBtn">
                            CONTACT CREATOR
                        </Button>

                    </div>
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

            <Item>
                <div className="lost_found_description_box">
                    <h5 className="r3_description_title">Description: </h5>

                    <h6 className="r3_description_content">{postInfo.description}</h6>
                </div>
            </Item>

            <Modal title="Delete this item"
                visible={isDeleteModalVisible}
                onOk={handleOk}
                onCancel={handleCancel} >

                Reason to delete:
                <input placeholder="reason to delete" name="reason"
                    onChange={(e) => setReason(e.target.value)} />
            </Modal>
        </Card >
    );

}