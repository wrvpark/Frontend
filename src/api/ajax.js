import axios from 'axios';
import { message } from 'antd';
import tokenCheck from './tokenRefresher'


/**
 * AJAX call logic for backend calls
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

    return new Promise(function (resolve, reject) {
        let promise;

        // Handle refresh token if access token has expired
        const check = tokenCheck();
        
        if (check) {
            // Handle Get request (GET)
            if (method === 'GET') {
                promise = axios.get(url, { params: data })
            }
            // Handle Post request (CREATE)
            else if (method === 'POST') {
                if (token !== null) {
                    promise = axios.post(url, data,
                        { headers: { "Authorization": `Bearer ${token}` } })
                } else {
                    promise = axios.post(url, data)
                }
            }
            // Handle Put request (UPDATE)
            else if (method === 'PUT') {
                if (token !== null) {

                    promise = axios.put(url, data,
                        { headers: { "Authorization": `Bearer ${token}` } })

                }
                else {
                    promise = axios.put(url, data);
                }

            }
            // Handle Delete request (DELETE)
            else if (method === 'DELETE') {
                promise = axios.delete(url,
                    { headers: { "Authorization": `Bearer ${token}` } }, data)
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

