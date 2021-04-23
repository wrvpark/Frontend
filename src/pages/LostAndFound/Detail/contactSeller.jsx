
// Imports
import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { List, message, } from 'antd';
import Form from "react-bootstrap/Form";
import emailjs from "emailjs-com";

// Css files
import "./detail_page.css"


const Item = List.Item;

/**
 * Contact creator modal for lost & found and handles submitting email to creator
 * 
 * @author Charles Breton Chen Zhao
 * @returns Contact creator modal for lost & found
 */
class ContactSeller extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            contactName: '',
            contactMessage: '',
            contactPhoneNumber: '',
        };
    }


    // componentDidMount() {
    // }

    // Render component
    render() {

        return (
            <>
                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>CONTACT SELLER</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.postResponse}>
                        <Modal.Body>
                            <Form.Row >
                                <Form.Group className="contact_name_box">
                                    <Form.Group className="col-md-8">
                                        <h5>NAME</h5>
                                    </Form.Group>
                                    <Form.Control
                                        placeholder="YOUR NAME"
                                        name="name"
                                        className="contact_name_input"
                                        id="contact_name"
                                        fluid='true'
                                        value={this.state.contactName}
                                        onChange={(event) => this.setState({ contactName: event.target.value })}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group className="contact_phoneNo_box">
                                    <Form.Group className="col-md-15">
                                        <h5>PHONE NUMBER</h5>
                                    </Form.Group>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        placeholder="YOUR PHONE NUMBER"
                                        className="contact_phoneNo"
                                        id="contact_name"
                                        fluid='true'
                                        value={this.state.contactPhoneNumber}
                                        onChange={(event) => this.setState({ contactPhoneNumber: event.target.value })}
                                    />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row className="">
                                <Form.Group className="col-md-8">
                                    <h5>MESSAGE</h5>
                                </Form.Group>
                                <Form.Group className="contact_message_box">

                                    <Form.Control
                                        as="textarea"
                                        name="message"
                                        rows="10"
                                        // width= "100%"
                                        fluid='true'
                                        placeholder="MESSAGE"
                                        className="col-md-50"
                                        id="description"

                                        value={this.state.contactMessage}
                                        onChange={(event) => this.setState({ contactMessage: event.target.value })}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <input type="hidden" name="subject" value={this.props.post.title}></input>
                            <input type="hidden" name="section" value="Lost & Found"></input>
                            <input type="hidden" name="sendTo" value={this.props.post.creator.email}></input> {/*{this.props.user.email}*/}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit" variant="secondary" className='det_done_button'>
                                SEND MESSAGE
                         </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
        );
    }

    // Handle closing modal
    closeModal = (arg) => {
        this.props.onCloseWindow(arg);
    }

    // Formatting file to remove id    
    formatFile = (file) => {
        if (file !== undefined) {
            const formatted = file[0].split('-')[5];
            this.setState({ fileFormatted: formatted })
        }
    }

    // Handle submitting entered info
    postResponse = (e) => {
        /*let email = this.props.user;
        let subject = this.props.post.title;
        let to_name = this.props.user.name;
        let from_name = this.state.contactName;
        let messageBody = this.state.contactMessage;
        let phoneNumber = this.state.contactPhoneNumber;
        let sendTo = "wendysrvpark@gmail.com";
        let sendFrom = "wendysrvpark@gmail.com";

        console.log(email);
        console.log(subject);
        console.log(to_name);
        console.log(from_name);
        console.log(messageBody);
        console.log(phoneNumber);*/

        e.preventDefault();
        //let email = this.props.post.creator.email
        /*console.log(e.target.name.value);
        console.log(e.target.phone.value);
        console.log(e.target.message.value);*/
        let sentName = e.target.name.value;
        let sentPhone = e.target.phone.value;
        let sentMessage = e.target.message.value

        if (sentName != "" && sentPhone != "" && sentMessage != "") {
            emailjs.sendForm('service_oqim4hi', 'template_ekw0lr5', e.target, 'user_6G7eyny9I0mK7uj0nSA6S')
                .then((result) => {
                    console.log(result.text);
                }, (error) => {
                    console.log(error.text);
                });



            message.success("Mesage Sent Successfully")

        } else {
            message.warning("Failed, please fill all the information")
        }

        this.closeModal()
    }
}

export default ContactSeller;


