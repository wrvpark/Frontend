import jwt_decode from "jwt-decode";

/**
 * Handle decoding token
 * 
 * @author Charles Breton
 */
export function decodeToken() {
    // Retrieve tokens
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    // Storage in localStorage by deciphering using jwt_decoder
    localStorage.setItem("session_details", JSON.stringify(jwt_decode(token)) )
    localStorage.setItem("refresh_details", JSON.stringify(jwt_decode(refresh)) )
    
}