// Imports
import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { List, message, } from 'antd';

// API calls
import { postSaleAndRent } from '../../../api/apifunction'


const Item = List.Item;


/**
 * Class that handle rendering and logic behind confirmation modal for Sale & Rent Section
 * 
 * @author Charles Breton
 * @returns Modal to confirm posting
 */

class ConfirmationModal extends Component {

    // State handler
    constructor() {
        super();
        this.state = {
            content: {},
            title: '',
            description: '',
            isOpen: true,
            category: {},
            images: {},
            formattedImages: [],
            price: '',
            lotNumber: '',
        };
    }

    // Load initial data to state
    componentDidMount() {
        // Save data to state
        this.setState({ content: this.props.displayPost });
        this.setState({ title: this.props.displayPost[0] });
        this.setState({ description: this.props.displayPost[1] });
        this.setState({ images: this.props.displayPost[2] });
        this.setState({ category: this.props.displayPost[3] });
        this.setState({ lotNumber: this.props.displayPost[4] });
        this.setState({ price: this.props.displayPost[5] });

        this.formatFile(this.props.displayPost[2]);
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


    // Rendering Modal for confirming post
    render() {

        return (
            <>
                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Item>
                            <span>Category: {this.state.category.label}</span>
                            <span>Price: {this.state.price}</span>
                            <span>Lot Number: {this.state.lotNumber}</span>
                        </Item>
                        <Item>
                            <span>Desc: {this.state.description}</span>
                        </Item>
                        <Item>
                            <span>File Attached:</span>

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

    // Close modal 
    closeModal = (arg) => {
        this.props.onCloseWindow(arg);
    }

    // Display Button Update or Create based of users action
    buttonTypeDisplay = () => {
        if (this.props.rawData.length !== 0) {
            return true;
        }
        return false;
    }




    // Handle submiting post
    postToServer = async () => {
        // Allow retrieval from session storage
        const token = JSON.parse(localStorage.getItem("session_details"))

        // Create format for values to send to post request
        const subcategory_id = this.state.category.value
        const title = this.state.title;
        const lot_no = parseInt(this.state.lotNumber);
        const description = this.state.description;
        const mlsLink = "";
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
        const response = await postSaleAndRent(id, subcategory_id, title,
            lot_no, description, mlsLink, price, contact_info, image, status);
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


