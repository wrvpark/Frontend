import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { message } from 'antd';

// API functions
import { deleteEvent } from '../../api/apifunction'

// Css files
import './detailModal.css'

// Access token
const token = localStorage.getItem("access_token");

/**
 * Event Component that handles viewing event post
 * 
 * @author Charles Breton Illia Bondarenko
 * @returns Event Detail Page
 */
class DisplayEventInfo extends Component {
  constructor() {
    super();
    this.state = {
      content: {},
      isOpen: true,
      creator: {},
      isAdmin: false,
    };
  }
  
  // Check users permission using token to determine if they can update or delete post
  checkAccountPermission = () => {
    if (token !== null) {
      const token_info = JSON.parse(localStorage.getItem("session_details"));
      for (let i = 0; i < token_info.realm_access.roles.length; i++) {
        if (token_info.realm_access.roles[i] === "admin") {
          i = token_info.realm_access.roles.length
          return true;
        }
      }
      if (token_info.sub === this.props.displayEvent.creator?.id) {
        return true;
      }
    }
    return false;
  }

  // Handle deleting post
  deletePost = () => {
    this.deleteItem();
  }


  // Async function for API calls
  deleteItem = async () => {
    const tokenInfo = JSON.parse(localStorage.getItem("session_details"));
    const modifierId = tokenInfo.sub;
    const description = "";
    const reason = "======="

    const response = await deleteEvent(this.props.displayEvent.id, description, reason, modifierId);
    try {
      if (response !== "Network Error" && response.status !== 401) {
        if (response.data.status === "SUCCESS") {
          this.closeModal()
          message.success("Deleted Event Post")
          window.location.reload();
        } else {
          message.error(response.data.message)
        }
      } else {
        message.error(response.data.message)
      }
    } catch (error) { }
  }

  // Rendering modal for viewing event post
  render() {
    return (
      <>
        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title><h2>{this.props.displayEvent.title}</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              < span className='det_description event_font_size'>{this.props.displayEvent.description}. There are only three ways to make this work. The first is to let me take care of everything. The second is for you to take care of everything. The third is to split everything 50 / 50. I think the last option is the most preferable, but I'm certain it'll also mean the end of our marriage.</span>
              <br /><br />
              <div >
                <span className='det_start_time event_font_size'>
                  Start time: {this.props.displayEvent.startTime}
                </span>
                <br />
                <span className='det_end_time event_font_size'>
                  End time: {this.props.displayEvent.endTime}
                </span>
              </div>

              {/* Add this once we implement frequency */}
              {/* <div className='det_inline_block_shedule'>

                <div className='det_con_frequency'>
                <span>Frequency:</span>
                <span className='det_frequency'> {this.state.content.recurFrequency}</span>
                  
                </div>
              </div> */}

              <div className='det_sec_categories'>
                <div className='det_con_category'>
                  <span className='det_category event_secondary_font_size'>Category: {this.props.displayEvent.descSubcategory.name} </span>
                </div>
                <div className='det_con_location'>
                  <span className='det_location event_secondary_font_size'>Location: {this.props.displayEvent.locationSubcategory.name}</span>
                </div>
              </div>

              {/* Last Line */}
              <div className='det_sec_end'>
                <div className='det_con_qFile'>
                  {this.props.displayEvent.fileURL ?
                    <a className='det_link' target="_blank" rel="noopener noreferrer" href={this.props.displayEvent.fileURL}>File attached</a>
                    : null
                  }
                </div>
                <div className='det_con_posted'>
                  {this.props.displayEvent.creator.firstName !== "Admin" ? 
                    <span className='det_posted event_creator_font_size'>Posted by: {this.props.displayEvent.creator.firstName} {this.props.displayEvent.creator.lastName}</span>
                    : <span className='det_posted event_creator_font_size'>Posted by: {this.props.displayEvent.creator.firstName}</span> }
                  
                </div>
              </div>
            </div>
          </Modal.Body>

          {/* Determine to show action buttons */}
          {this.checkAccountPermission() ?
            <Modal.Footer>
              <Button type="button" className="event_update_button" onClick={() => this.props.history.router.push('/event/addUpdate', this.props.displayEvent)}>
                <span className="event_update_button_header">UPDATE</span>
              </Button>
              <Button type="button" className="event_delete_button" onClick={() => this.deletePost()}>
              <span className="event_update_button_header">DELETE</span>
              </Button>
            </Modal.Footer>
            : null}
        </Modal>
      </>
    );
  }

  // Handling closing modal
  closeModal = (arg) => {
    this.props.onCloseWindow(arg);
  }
}

export default DisplayEventInfo;