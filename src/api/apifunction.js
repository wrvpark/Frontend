import ajax from "./ajax";
import ajaxLog from "./ajaxLog";
import axios from "axios";
import { message } from "antd";

//Declare the base path
const BASE = "http://wrvpark.com:8080/api/v1/";


// LOGIN
export const userLogin = (username, password) =>
  ajax(BASE + "user/login", { username, password }, "POST");

// REGISTER
export const getRefreshToken = (refresh_token) =>
  ajax(BASE + "user/refresh", { refresh_token }, "POST");


// Register

export const registerUser = (first_name, last_name, lot_no, password, confirm_password, email, primary_phone, secondary_phone, is_owner, is_renter, is_board_member, is_park_management, is_admin, picture, doc_notification, event_notification, salerent_notification, service_notification, lostfound_notification) =>
    ajax(BASE + "user/register", {first_name, last_name, lot_no, password, confirm_password, email, primary_phone, secondary_phone, is_owner, is_renter, is_board_member, is_park_management, is_admin, picture, doc_notification, event_notification, salerent_notification, service_notification, lostfound_notification}, 'POST');


// for picture retrieval
export const h = () => ajax('https://jsonplaceholder.typicode.com/todos/1', null);

// IMAGES

export const deleteFile = (id) => ajax(BASE + "files/" + id, null, "DELETE")

//add response
/*export const respondToPost = (originalPostId, responderId, details, image) =>
  ajax(BASE + "forum/response", { originalPostId, responderId, details, image});*/
  export const respondToPost = (originalPostId, details, image) =>
  ajax(BASE + "forum/post/" + originalPostId + "/response", {details, image}, "POST");


// HOME PICTURES
export const getHomePictures = () => ajax(BASE + "pictures", null);




//=========== PARK DOCUMENT SECTION ============//


// Get all the park documents
export const getParkDocs = () => ajax(BASE + "documents");

//add a new park document sub-category
export const addParkDocumentSubcateogry = (name,parentId,type,id) =>
  ajax(BASE + "categories/document", {name,parentId,type,id}, "POST");
// Search park documents
export const searchParkDocs = (name, subId, startTime, endTime, uId) =>
  ajax(BASE + "documents/search", { name, subId, startTime, endTime, uId });


// Add a new park document
export const addParkDocument = (name, subId,description, fileName) =>
  ajax(BASE + "documents", { name, subId, description, fileName }, "POST");

// Update a park document
export const updateParkDocument = (
  id,
  name,
  subId,
  description,
  fileName
) =>
  ajax(
    BASE + 'documents/' + id,
    {name, subId,  description, fileName },
    "PUT"
  );

// Delete a park document
export const deleteParkDocument = (itemId, description, reason, modifierId) =>
  ajax(BASE + "documents/delete", { itemId, description, reason, modifierId }, "PUT");



//=========== EVENTS SECTION ============//


// Get all events
export const eventRetrieval = () => ajax(BASE + "events", null);

// Get events based off category selection
export const searchEventsByCategory = (locId, descId) => ajax(BASE + "events/search", { locId, descId });

// Get events based off search
export const searchEventsBySearch = (eventName) => {
  return new Promise(function (resolve, reject) {
    let promise = axios.get(BASE + 'events/searchName/' + eventName.toString());
    promise.then(response => {
      // success
      resolve(response.data)
    }).catch(error => {
      // fail
      message.error('Request fail: ' + error.message)
    })
  });
}

// Add a new event
export const addEvent = (uId, title, description, startTime, endTime, details, fileName, isLimited, locSubId, descSubId, recurring) =>
  ajax(BASE + "documents", { uId, title, description, startTime, endTime, details, fileName, isLimited, locSubId, descSubId, recurring }, "POST");


// Delete a Event post
export const deleteEvent = (itemId, description, reason, modifierId) =>
   ajax(BASE + "events/delete", { itemId, description, reason, modifierId }, "PUT");




//=========== FORUM SECTION ============//

// Get all forums
export const getForums = () => ajax(BASE + "forum/posts");

// Get response for specific forum post
export const getForumResponses = (id) => ajax(BASE + "forum/post/" + id);

// Search for forums
// export const searchForum = (param, subId, date) =>
//   ajax(BASE + "forums/search", { param, subId, date });

// Search for forums posts
export const searchTheForum = (keywords, start_time, end_time) =>
  ajax(BASE + "forum/search", { keywords, start_time, end_time }, "POST");


// Get specific forum post
export const getForumPostInfo = (id) => ajax(BASE + "forum/post/" + id)

// Post forum
export const postForum = (title, details, type, file, status) => ajax(BASE + 'forum/post', { title, details, type, file, status }, "POST");
export const putForum = (id, title, details, type, file, status) =>
  ajax(BASE + 'forum/post/' + id, { title, details, type, file, status }, "PUT");


// Delete forum
export const deleteForum = (id,description, reason) =>
   ajax(BASE + "forum/postDeleting/"+id, { description, reason}, "PUT");
 






//=========== SALE & RENT SECTION ============//

// Get all Rent post
export const getRent = () => ajax(BASE + "salerent/rent");

// Get all Sale post
export const getSale = () => ajax(BASE + "salerent/sale");

// Search for Sale & Rent posts
export const searchSaleRentItems = (name, subId, endTime, startTime, uId) =>
  ajax(BASE + "salerent/search", { name, subId, endTime, startTime, uId }, "GET");


// Get specific post
export const getSaleOrRentPostInfo = (id) => ajax(BASE + "salerent/" + id)

// Post a Sale & Rent post
export const postSaleAndRent = (id, subcategory_id, title, lot_no, description, mlsLink, price, contact_info, image, status) => ajax(BASE + 'salerent/' + id, { subcategory_id, title, lot_no, description, mlsLink, price, contact_info, image, status }, "POST");

// Delete a Sale & Rent post
export const deleteSaleAndRent = (itemId, modifierId, description, reason) =>
  ajax(BASE + "salerent/delete", { itemId, description, reason, modifierId }, "PUT");






//=========== LOST & FOUND SECTION ============//

// Get all Lost & Found post
export const getLostAndFound = () => ajax(BASE + "lostfound");


// Search for Lost & Found posts
export const searchLostAndFoundItems = (name, subId, endTime, startTime, uId) =>
  ajax(BASE + "lostfound/search", { name, subId, endTime, startTime, uId }, "GET");


// Get info on a specific post
export const getLostAndFoundPostInfo = (id) => ajax(BASE + "lostfound/" + id)

// Post a Lost & Found post
export const postLostAndFound = ( id, title, description,
            mls_link, subcategory_id, contact_info, image, price,status) =>
  ajax(BASE + 'lostfound/' + id,
    {title, description,
      mls_link, subcategory_id,
      contact_info, image,  price, status
    }, "POST");


// Delete a Lost & Found post
export const deleteLostAndFound = (itemId, description, reason, modifierId) =>
   ajax(BASE + "lostfound/delete", { itemId, description, reason, modifierId }, "PUT");





//=========== SERVICE SECTION ============//

// Get all Services post
export const getServices = () => ajax(BASE + "services");


// Search for Service posts
export const searchService = (name, subId, endTime, startTime, uId) =>
  ajax(BASE + "services/search", { name, subId, endTime, startTime, uId }, "GET");


// Get specific services post
export const getServicesPostInfo = (id) => ajax(BASE + "services/" + id)

// Post a Services post
export const postServices = (id, subcategory_id, title, 
  lot_no, description, mlsLink, price, contact_info, image, status) =>
  ajax(BASE + 'services/' + id, { subcategory_id, title, 
    lot_no, description, mlsLink, price, contact_info, image, status }, "POST");

export const deleteServices = (itemId, modifierId, description, reason) =>
  ajax(BASE + "services/delete", { itemId, description, reason, modifierId }, "PUT");





//=========== ADMIN SECTION ============//

// LOG SECTION
export const getLogs = () => ajaxLog(BASE + "log");
export const searchLogs = (name, subId, endTime, startTime, uId) =>
  ajaxLog(BASE + "log/search", { name, subId, endTime, startTime, uId }, "GET");

export const getUsers = () => ajaxLog(BASE + "admin/users");
export const getUserInfo = (id) => ajaxLog(BASE + "admin/user/" + id);
export const postUserInfo = (id, first_name, last_name, lot_no, is_owner, is_renter, is_board_member, is_park_management, is_admin, is_visitor, is_unapproved) => ajax(BASE + "admin/user/" + id, {first_name, last_name, lot_no, is_owner, is_renter, is_board_member, is_park_management, is_admin, is_visitor, is_unapproved} , "POST");


  


//=========== CATEGORIES ============//
 
// Get sub-categories for a main category
export const fetchSubCategories = (pId) => {
  return new Promise(function (resolve, reject) {
    let promise = axios.get(
      BASE + "categories/id/" + pId.toString()
    );
    promise
      .then((response) => {
        // success
        resolve(response.data);
      })
      .catch((error) => {
        // fail
        message.error("Request fail: " + error.message);
      });
  });
};


// Get sub-categories by main category name
export const fetchSubCategoriesByMainCategoryName = (pName) => {
  return new Promise(function (resolve, reject) {
    let promise = axios.get(
      BASE + "categories/name/" + pName.toString()
    );
    promise
      .then((response) => {
        // success
        resolve(response.data);
      })
      .catch((error) => {
        // fail
        message.error("Request fail: " + error.message);
      });
  });
};

export const getCategoryIDs = () => ajax(BASE + 'categories');

export const getCategories = () => ajax(BASE + 'categories');



