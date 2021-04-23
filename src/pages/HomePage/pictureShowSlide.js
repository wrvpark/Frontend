// Imports
import React, { useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';
import { message } from 'antd';

// Api calls
import { getHomePictures } from '../../api/apifunction'


// Style
import 'react-slideshow-image/dist/styles.css'
import './ShowSlide.css';

// Slide properties
const properties = {
    duration: 10000,
    transitionDuration: 800,
    infinite: true,
    indicators: true,
    arrows: true
}


/**
 * Slideshow for home page
 * 
 * @author Charles Breton
 * @returns A slide show to use for home page
 */

const Slideshow = () => {
    // Track data receive from ajax call
    const [pictures, setPictures] = useState([]);

    // Initial call
    useEffect(() => {
        fetchPictures();
    }, [])

    // Fetch call
    const fetchPictures = async () => {
        let response = await getHomePictures();

        if (response !== "Network Error" && typeof response.data !== 'undefined') {
            if (response.data.status === "SUCCESS" && response.data.data !== null) {
                console.log(response.data.data)
                setPictures(response.data.data)
                console.log(response.data.data[0].url)
            } else {
                message.error(response.data.message);
            }
        }
    }

    // Pictures components
    const loadPictures = pictures.map((item) =>
        <div className="each-slide">
            <div style={{ 'backgroundImage': `url(${item.url})`, 'width': '100%' }}>
            </div>
        </div>
    )

    // Return statement
    return (
        <div className="slideshow">
            <Slide {...properties}>
                {loadPictures}
            </Slide>
        </div>
    )
}

export default Slideshow;