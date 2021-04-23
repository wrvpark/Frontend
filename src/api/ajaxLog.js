import axios from 'axios';
import { message } from 'antd';
import tokenCheck from './tokenRefresher'

/**
 * AJAX call for Get request that need admin privs
 * 
 * @author Charles Breton Isabel Ke
 * @param {*} url url used to server
 * @param {*} data the set of data used to be sent to server
 * @param {*} method type of request to perform
 * @returns 
 */
export default function ajax(url, data = {}, method = 'GET') {
    // Retrieve access token (JWT token)
    const token = localStorage.getItem("access_token");
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` };

    return new Promise(function (resolve, reject) {
        let promise;

        // Handle refresh token if access token has expired
        const check = tokenCheck();

        //request data from the server
        if (check) {
            // Handle Get request (GET)
            if (method === 'GET') {
                if (token !== null) {
                    promise = axios.get(url,
                        { params: data }
                    )
                }
            }

            // Return response
            promise.then(response => {
                // success
                resolve(response)
            }).catch(error => {
                // fail
                resolve(error.message);
                message.error('Request fail: ' + error.message)
            })
        }
    })
}

