// Imports
import React, { Component } from 'react'
import { message } from 'antd';

// full calendar components
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'

// Projects functions
import DisplayEventInfo from '../viewEvent'

// API calls
import { eventRetrieval } from '../../../api/apifunction'

// Css file
import '../event.css';

/**
 * Event Component that handles calendar
 * @author Charles Breton Illia Bondarenko
 * @returns Event Calendar Page
 */
export default class EventCalendar extends Component {
  // States
  constructor() {
    super();
    this.state = {
      dateSelected: null,
      events: [],
      displayEvent: {},
      // Modal display
      showEventInfo: false,
    }
  }

  // Initial function calls
  componentDidMount() {
    this.fetchEvents();
  }

  // Fetching event data for loading Calendar
  fetchEvents = async () => {
    const response = await eventRetrieval();
    // Check if fetching was successful
    if (response !== "Network Error" && typeof response.data !== 'undefined' ) {
      if (response.data.status === "SUCCESS") {
        let formatting = []
        if (response.data.data !== null) {
          for (let i = 0; i < response.data.data.length; i++) {
            let entry = {
              title: response.data.data[i].title,
              id: response.data.data[i].id,
              date: response.data.data[i].startTime,
              content: response.data.data[i]
            }
            formatting.push(entry)
          }
          this.setState({ events: formatting })
        } else {
          message.error(response.data.message)
        }
      } else {
        message.error(response.data.message)
      }
    }
  }

  // Close popup window for Event Info
  onCloseWindow = () => {
    this.setState({
      showEventInfo: false
    });
  }


  // Render Calendar component
  render() {
    return (
      <div>
        <div className="calendar">
          {this.state.showEventInfo ?

            <DisplayEventInfo onCloseWindow={this.onCloseWindow} displayEvent={this.state.displayEvent} />
            : null
          }
          <FullCalendar
            plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={{
              left: 'title',
              center: null,
              right: 'prev next today'
            }}
            dateClick={this.loadSideMenu}

            eventClick={this.loadEventInfoPlus}
            eventContent={renderEventContent}
            events={this.state.events}
          />
        </div>
      </div>
    )
  }


  // Handle event info display
  loadEventInfoPlus = (arg) => {
    this.setState({ displayEvent: arg.event._def.extendedProps.content }) 
    this.setState({
      showEventInfo: !this.state.showEventInfo
    });
  }

}

// Show the title of events
function renderEventContent(eventInfo) {
  return (
    <>
      <b className="calendar_event_title">{eventInfo.event.title}</b>
    </>
  )

}

