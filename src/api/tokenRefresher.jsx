
// Imports
import { message } from 'antd';
import axios from "axios";

// Custom components
import { decodeToken } from "../Components/Account/decodeAccessToken";
const BASE = "http://wrvpark.com:8080/api/v1/";


/** 
 * Token check to determine if we need to update token
 *  
 * @author Charles Breton
 * @returns 
 */
export default function tokenCheck() {
    
    // Retrieve your access token if you have one
    const token = localStorage.getItem("access_token");

    // Determine if token is not valid anymore
    if (token !== null) {
        // Retrieve decoded token info to determine expire time
        const token_info = JSON.parse(localStorage.getItem("session_details"));
        const refresh_info = JSON.parse(localStorage.getItem("refresh_details"));

        // Get formatted date of current time
        const currentTime = parseInt(new Date().getTime())
        const formattedTime = parseInt(currentTime.toString().substring(0, 10))

        // If refresh token has expired 
        if (formattedTime >= refresh_info.exp) {
            localStorage.clear()
            window.location.reload()
            return false;
        } 
        // If access token has expired
        else if (formattedTime >= token_info.exp) {
            refreshToken();
            return false;
        } else {
            return true;
        }

    } else {
        return true;
    }
}



// API call to refresh token 
const getRefreshToken = async (data) => {
    const url = BASE + "user/refresh"
    return new Promise(function (resolve, reject) {
        let promise = axios.post(url, data);
        promise
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                message.error("Request fail: " + error.message);
            });
    });
}


// Handle response from server with new access token
const refreshToken = async () => {
    // Retrieve refresh token to send
    const refresh_token = localStorage.getItem("refresh_token")
    const response = await getRefreshToken({ refresh_token });
    try {
        if (response !== null && typeof response !== 'undefined') {

            // Updating tokens and storing then in localStorage
            localStorage.setItem('access_token', response.access_token)
            localStorage.setItem("refresh_token", response.refresh_token)

            decodeToken();
            window.location.reload()
        }
    } catch (error) { }

}
