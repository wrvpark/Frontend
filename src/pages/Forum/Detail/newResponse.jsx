import React, { useState, Component, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Card, List, message, } from 'antd';
import Form from "react-bootstrap/Form";
import { respondToPost } from '../../../api/apifunction';

const Item = List.Item;



class NewResponse extends Component {
    constructor() {
        super();
        this.state = {
            content: {},
            isOpen: true,
            category: {},
            fileFormatted: '',
            message: '',
            errorMessage: '',
        };
        this.postResponse = this.postResponse.bind(this);
    }
    componentDidMount() {

        // this.setState({ content: this.props.displayEvent });
        // this.setState({ category: this.props.displayEvent[3] })
        // // setTimeout('', 5000);
        // this.formatFile(this.props.displayEvent[2])

    }

    render() {
        // console.log(this.state.file[0])
        // console.log(this.state.fileFormatted);
        // console.log(this.state.category.label)
        return (
            <>
                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>REPLY</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Form.Group className="descriptionGroup">
                                <p className="error">{this.state.errorMessage}</p>
                                <Form.Control
                                    as="textarea"
                                    rows="10"
                                    // width= "100%"
                                    // fluid='true'
                                    placeholder="MESSAGE"
                                    className="col-xs-10"
                                    id="description"

                                    onChange={(event) => this.setState({ message: event.target.value })}
                                // value={forumDesc}
                                // onChange={(event) => setForumDesc(event.target.value)}
                                />
                            </Form.Group>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className='createBtn' onClick={this.postResponse}>
                            <span className="createBtn_header">POST</span>
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    closeModal = (arg) => {
        this.props.onCloseWindow(arg);
    }

    formatFile = (file) => {
        if (file !== undefined) {

            const formatted = file[0].split('-')[5];
            this.setState({ fileFormatted: formatted })
        }
    }

    postResponse = () => {
        const token_info = JSON.parse(localStorage.getItem("session_details")); //admin@wrvpark.com password
        if (token_info != null) {
            const originalPostId = this.props.id;
            //const responderId = token_info.sub;
            const details = this.state.message;
            const image = "";

            console.log(originalPostId);
            //console.log(responses);
            console.log(details);
            if (details != "") {
                this.postAsyncCall(originalPostId, details, image)
                this.setState({ errorMessage: '' })
            } else {
                this.setState({ errorMessage: "Message is empty!" })
            }
            //console.log(this.props.responses);

        } else {
            message.warning("Yon need to login first!")
        }

        // this.closeModal()

    }

    postAsyncCall = async (postId, details, image) => {
        const response = await respondToPost(postId, details, image);
        console.log(response)
        try {
            if (response !== "Network Error") {
                console.log(response.data)
                if (response.data.status === "SUCCESS" && response.data.data !== null) {
                    message.success("Responses Sent Successfully")
                    this.closeModal()

                    // window.location.reload();
                } else {
                    message.error("Fetching wasn't successfull")
                }
            } else {
                message.error("Error with connecting to backend")
            }
        } catch (error) { }
    }
}

export default NewResponse;


