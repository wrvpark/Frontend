// Imports
import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { List, message, } from 'antd';

// API calls
import { postForum, putForum } from '../../../api/apifunction'

// Css files
import './add_update.css';

const Item = List.Item;

/**
 * Forum Component that handles confirmation modal
 *
 * @author Charles Breton
 * @returns Confirmation Modal for forum
 */
class ConfirmationModal extends Component {
    constructor() {
        super();
        this.state = {
            content: {},
            formattedImages: [],
            isOpen: true,
            category: [],
            files: [],
            type: [],
            details: '',
        };
    }

    // Initial call to store data about post
    componentDidMount() {
        this.setState({ content: this.props.displayPost });
        this.setState({ title: this.props.displayPost[0] });
        this.setState({ details: this.props.displayPost[1] });
        this.setState({ files: this.props.displayPost[2] });
        this.setState({ type: this.props.displayPost[3] });
        
        this.formatFile(this.props.displayPost[2])
    }

    // Formatting file to only display name without id
    formatFile = (file) => {
        let remainingImages = [];
        if (file !== null) {
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
                            <span>Category: {this.state.type.label}</span>
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
        const title = this.state.title;
        const details = this.state.details;
        const type = this.state.type.label;
        const file = this.state.files


        // WILL BE REMOVED LATER
        const status = "Active"

        // Check if we are updating or creating post
        let response = [];
        if (this.props.rawData.length !== 0) {
            let id = this.props.rawData.id
            response = await putForum(id, title, details, type, file, status);
        } else {
            response = await postForum(title, details, type, file, status);
        }

        // Post request
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
        } catch (error) {}
    };
}

export default ConfirmationModal;


