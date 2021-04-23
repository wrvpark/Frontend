// Import dependancies
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { Card, List, Modal, message, Button } from 'antd';
import Form from "react-bootstrap/Form";

// Project imports
import NewResponse from './newResponse'
import Responses from './responses'
import { getForumPostInfo, deleteForum } from '../../../api/apifunction'

// Css files
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './detail_page.css';


const Item = List.Item;

/**
 * Forum Component that handles viewing a post
 *
 * @author Charles Breton
 * @param {*} props info about state of pages use for Routing purposes
 * @returns Forum Detail Page
 */
export default function Detail(props) {
    // Access Token
    const token = localStorage.getItem("access_token");

    // Post info
    const id = localStorage.getItem("forum_post_id");
    const [postInfo, setPostInfo] = useState([]);
    const [responses, setResponses] = useState([])

    // Modal logics
    const [infoLoaded, setInfoLoaded] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [newResponse] = useState(true);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [reason, setReason] = useState("");
    var isAdmin = false;
    // Fetch Post info based off id
    useEffect(() => {
        fetchPostInfo();
    }, [])

    // Fetch function call to get post info
    const fetchPostInfo = async () => {
        const response = await getForumPostInfo(id)
        try {
            if (response !== "Network Error") {
                // console.log(response.data)
                if (response.data.status === "SUCCESS" && response.data.data !== null) {
                    setPostInfo(response.data.data)
                    setResponses(response.data.data.responses)
                    localStorage.setItem("load_files", JSON.stringify(response.data.data.file));
                    setInfoLoaded(true)
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

        if (showModal === true) {
            setShowModal(false);
        }

        fetchPostInfo();

    };


    // Prevent redirect when clicking on Post Details header
    const handleClick = (e) => {
        e.preventDefault()
    }




    // Check for permission to modify or delete post
    const checkAccountPermission = () => {
        if (!postInfo.closed) {
            if (token !== null) {
                const token_info = JSON.parse(localStorage.getItem("session_details"));
                // console.log(token_info)
                for (let i = 0; i < token_info.realm_access.roles.length; i++) {
                    if (token_info.realm_access.roles[i] === "admin") {
                        return true;
                    }
                }
                if (token_info.sub === postInfo.creator?.id) {
                    return true;
                }
            }
        }
        return false;
    }

    const PostStatus = () => {
        console.log(postInfo.closed)
        if (postInfo.closed) {
            return (
                <div>
                    <br />
                    <h4>FORUM POST CLOSED</h4>
                </div>
            )
        } else {
            return (<h4></h4>)
        }
    }


    const deletePost = () => {
        //if it is admin, then show the modal to get the reason
        if (isAdmin) {
            setIsDeleteModalVisible(true);
        }
        //if it is the original creator, just delete this forum
        else {
            deleteItem();
        }
    }

    // API call to delete item
    const deleteItem = async () => {
        const response = await deleteForum(postInfo.id, "", reason);
        try {
            if (response !== "Network Error" && response.status !== 401) {
                if (response.data.status === "SUCCESS") {
                    props.history.push('/forum');
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
    // Display list of current files for forum post
    const fileList = () => {
        if (typeof postInfo.file !== 'undefined') {
            const listItems = postInfo.file.map((item) =>
                <li key={item}>
                    <a rel="noreferrer" href={item} target="_blank">
                        {item.split('-')[5]}
                    </a>


                </li>
            );
            return (
                <ul>
                    {listItems}
                </ul>
            )
        }
    }

    // Header of the page and link to go back to main section page
    const title = (
        <Fragment>
            <div>
                <NavLink to="/forum" exact className="backToEvent">
                    FORUM
                </NavLink>
                <h1> {">"} </h1>
                <NavLink to="/forum/detail" onClick={handleClick} exact className="currPage">
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
                                props.history.push("/forum/addUpdate", postInfo)
                            }
                        >
                            UPDATE
              </Button>
              &emsp;
                        <Button type="button" className="checkBtn" onClick={() => deletePost()}>
                            DELETE
              </Button>
                    </div>
                ) : <PostStatus />}


            </div>
        </Fragment>
    );

    // Render component
    return (
        <Card title={title}>
            {/* Display Contact Seller Modal */}
            {showModal ?
                <NewResponse onCloseWindow={onCloseWindow} id={id} post={postInfo} responses={responses} newResponse={newResponse} />
                : null
            }


            <Form.Row className="first_row">


                <Form.Group className="col-md-8">
                </Form.Group>

                <Form.Group className="item col-md-4">
                    <span className='date_format'>Date: {postInfo.createDate}</span>
                </Form.Group>

            </Form.Row>

            <Item>
                <div className="left">
                    <h4>Title: {postInfo.title}</h4>
                </div>
                <div className="right">
                    <h5>Category: {postInfo.type}</h5>
                </div>

            </Item>

            <Item>
                <div className='forum_creator_box'>
                    <h5 >Creator: {postInfo.creator?.firstName} {postInfo.creator?.lastName}</h5>
                </div>
            </Item>

            <Item>
                <div className="services_description_box">
                    <h5 className="r3_description_title">Description: </h5>

                    <h6 className="r3_description_content">{postInfo.details}</h6>
                </div>
            </Item>

            <Item>
                <div className='left'>
                    <h5>File Attached: </h5>
                    {fileList()}
                </div>
                {/* Determine if user has permission to update or delete post */}

            </Item>
            <List>
                <div>
                    <Item>
                        <div className='left'>
                            <span >Comments: </span>
                        </div>
                        <div className='right'>
                            {checkAccountPermission() ?
                                <Button
                                    type="button"
                                    className="checkBtn"
                                    onClick={() =>
                                        setShowModal(true)
                                    }>
                                    <div className="reply_button_content">
                                        REPLY
                                    {/* <IconText className='view_forum' icon={PlusOutlined} key={"list-vertical-bell-o"} /> */}
                                    </div>
                                </Button>
                                // <div className="forum_reply_button" onClick={() => setShowModal(true)} >

                                // </div>
                                : null}
                        </div>
                    </Item>
                    <Responses responses={responses} />
                </div>
            </List>

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