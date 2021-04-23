// Imports
import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { List, message, } from 'antd';

// API calls
import { postLostAndFound } from '../../../api/apifunction'

const Item = List.Item;

/**
 * Lost & Found Component that handles confirmation modal
 *
 * @author Charles Breton
 * @returns Confirmation Modal for Lost & Found
 */
class ConfirmationModal extends Component {

    constructor() {
        super();
        this.state = {
            content: {},
            isOpen: true,
            category: {},
            images: [],
            formattedImages: [],
        };
    }

    // Initial call to store data about post
    componentDidMount() {
        this.setState({ content: this.props.displayPost });
        this.setState({ title: this.props.displayPost[0] });
        this.setState({ description: this.props.displayPost[1] });
        this.setState({ images: this.props.displayPost[2] });
        this.setState({ category: this.props.displayPost[3] });

        this.formatFile(this.props.displayPost[2]);
    }

    // Formatting file to only display name without id
    formatFile = (file) => {
        let remainingImages = [];
        if (file !== undefined) {
            for (let i = 0; i < file.length; i++) {
                remainingImages.push(file[i].split('-')[5]);
            }
        }
        this.setState({ formattedImages: remainingImages })
    }

    // Render component
    render() {
        return (
            <>
                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.content[0]}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Item>
                            <span>Category: {this.state.category.label}</span>
                        </Item>
                        <Item>
                            <span>Desc: {this.state.content[1]}</span>
                        </Item>
                        <Item>
                            <span>File Attached: </span>
                        </Item>
                        <Item>
                            {this.fileList()}
                        </Item>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="createBtn" onClick={this.postToServer}>
                            <span className="createBtn_header">{this.buttonTypeDisplay() ? "UPDATE" : "CREATE"}</span>
                        </Button>

                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    // Show list of files
    fileList = () => {
        const listItems = this.state.formattedImages.map((item) =>
            <li key={item}>{item}</li>
        );
        return (
            <ul>
                {listItems}
            </ul>
        )
    }

    // Handle closing modal
    closeModal = (arg) => {
        this.props.onCloseWindow(arg);
    }

    // Determining if its updating or creating post
    buttonTypeDisplay = () => {
        if (this.props.rawData.length !== 0) {
            return true;
        }
        return false;
    }


    // Async function to pass data to server
    postToServer = async () => {
        // Allow retrieval from session storage
        const token = JSON.parse(localStorage.getItem("session_details"))

        // Create format for values to send to post request
        const subcategory_id = this.state.category.value;
        const title = this.state.title;
        const description = this.state.description;
        const mls_link = "";
        const price = this.state.price;
        const contact_info = token.preferred_username;
        const image = (this.state.images)

        // WILL BE REMOVED LATER
        const status = "Active"


        // Check if we are updating or creating post
        let id = "";

        if (this.props.rawData.length !== 0) {
            id = this.props.rawData.id
        }
        // Post request
        const response = await postLostAndFound(id, title, description,
            mls_link, subcategory_id, contact_info, image, price, status);
        try {
            if (response !== "Network Error" && typeof response.data.status !== 'undefined') {
                if (response.data.status === "SUCCESS") {
                    // Successfull
                    this.props.props.history.goBack();
                    message.success("Post Succesfully Posted")
                } else {
                    // Error
                    message.error("Error adding post to server")
                }
            } else {
                message.error("Server is down")
            }
        } catch (error) {

        }
    };

}

export default ConfirmationModal;


