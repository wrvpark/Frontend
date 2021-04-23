import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

import '../detailModal.css'


class DisplayEventInfo extends Component {
  constructor() {
    super();
    this.state = {
      content: {},
      isOpen: true,
      creator: {},
    };
  }
  componentDidMount() {
    
    this.setState({ content: this.props.displayEvent });
    this.setState({creator: this.state.content.creator})
    // console.log(this.props.displayEvent.descSubcategory.name)
  }

  render() {

    // console.log(this.content)
    return (
      <>
        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>SUCCESS!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>

              < span className='det_description'>{this.state.content.description}. There are only three ways to make this work. The first is to let me take care of everything. The second is for you to take care of everything. The third is to split everything 50 / 50. I think the last option is the most preferable, but I'm certain it'll also mean the end of our marriage.</span>


              <div className='det_inline_block_shedule'>
                <div className='det_con_det_time'>
                  <span className='det_start_time'>
                    Start time: {this.state.content.startTime}
                  </span>
                  <br />
                  <span className='det_end_time'>
                    End time: {this.state.content.endTime}
                  </span>
                </div>
                <div className='det_con_frequency'>
                  test
                  {this.state.content.recurring ?
                    <span className='det_frequency'>test{this.state.content.recurFrequency}</span>
                    : null
                  }
                </div>
              </div>

              <div className='det_sec_categories'>
                <div className='det_con_category'>
                  <span className='det_category'>Category: {this.props.displayEvent.descSubcategory.name}</span>
                </div>
                <div className='det_con_location'>
                  <span className='det_location'>Location: {this.props.displayEvent.locationSubcategory.name}</span>
                </div>
              </div> 

              {/* Last Line */}
              <div className='det_sec_end'>
                <div className='det_con_qFile'>
                  {this.props.displayEvent.fileURL ?
                    <a className='det_link' target="_blank"  href={this.props.displayEvent.fileURL}>File attached</a>
                    : null
                  }
                </div>
                <div className='det_con_posted'>
                  <span className='det_posted'>Posted: {this.props.displayEvent.creator.name}</span>
                </div>
              </div> 
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className='det_done_button' onClick={this.closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  closeModal = (arg) => {
    this.props.onCloseWindow(arg);
  }
}

export default DisplayEventInfo;