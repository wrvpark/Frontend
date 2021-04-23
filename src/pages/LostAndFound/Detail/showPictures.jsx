
import React, { useEffect, useState } from 'react';

import { Slide } from 'react-slideshow-image';
import { message } from 'antd';
import no_image_placeholder from '../../../images/no_image_placeholder.jpg'

// Style
import 'react-slideshow-image/dist/styles.css'
import './ShowSlide.css';

// Slide properties
const properties = {
    duration: 5000,
    transitionDuration: 800,
    infinite: true,
    indicators: true,
    arrows: true
}

/**
 * Slideshow for Lost & Found
 * 
 * @param {*} data picture used for the slider
 * @returns A slide show to use for Lost & Found page
 */
const Slideshow = (data) => {

    const [images, setImages] = useState(data.images)

    useEffect(() => {
        setImages(data.images)
    })

    // Handle logic for displaying picture if any or use placeholder image if no pictures
    const LogicDisplay = () => {
        if (typeof images !== 'undefined') {
            if (images.length !== 0) {

                const loadPictures = images.map((item) =>
                    <div className="each-slide">
                        <div style={{ 'backgroundImage': `url(${item})`, 'object-fit': 'cover' }}>
                        </div>
                    </div>
                )
                return (
                    <Slide {...properties}>
                        {loadPictures}
                    </Slide>
                )
            } else {
                return (
                    <div no_image_placeholder>
                        <img src={no_image_placeholder} width='80%' className="no_image_placeholder" alt="no_image_placeholder" />
                    </div>
                )
            }
        } else {
            return (
                <div no_image_placeholder>
                    <img src={no_image_placeholder} width='80%' className="no_image_placeholder" alt="no_image_placeholder" />
                </div>
            )
        }
    }

    // Render component
    return (
        <div className="slideshow">
            <LogicDisplay />
        </div>
    )
}

export default Slideshow;