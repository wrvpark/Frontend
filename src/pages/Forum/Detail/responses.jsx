// Imports
import React , { useEffect } from 'react';
import { List, Space } from 'antd';

// Css files
import './detail_page.css';
import 'antd/dist/antd.css';


/**
 * Forum Component that handles displaying post responses
 * 
 * @author Charles Breton
 * @param {*} props 
 * @returns Specific post responses
 */
export default function Responses(props) {

    // Responses for specific post
    const responses = props.responses

    // Render component
    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: page => {

                },
                pageSize: 6
            }}


            dataSource={responses}
            renderItem={item => (
                <List.Item
                    className="responses_post"
                >
                    <div className="comments-header-inline">
                        <div className='left'>
                            <span >Creator: </span>
                            <span>{item.responderName}</span>
                        </div>
                        <div className="comments-right">
                            <span>Date:  </span>
                            <span> {item.responseTime}</span>
                        </div>

                    </div>
                    <div className="response-description">
                        <span>{item.details}</span>
                    </div>
                    

                </List.Item>
            )}
        />
    )
}