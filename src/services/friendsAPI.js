/**
 * HTTP request handler for Friends-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken, getUserID } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const SEARCH_USER_ENDPOINT = BASE_URL + "friendships/search";
const ADD_FRIEND_ENDPOINT = BASE_URL + "friendships/request";
const GET_FRIENDSHIPS_ENDPOINT = BASE_URL + "friendships/friends";

// Auth setup
const headers = {
  headers: {
    Authorization: getAccessToken(),
    "Content-Type": "application/json"
  },
};

/**
 * Get a list of users
 * * @param {*} filter any search filter option
 * @returns list of users
 */
export const getUsers = async function (filter) {
  const body = {
    DisplayName: filter,
  };

  try {
    let response = await axios.post(SEARCH_USER_ENDPOINT, body);

    //Success!
    if (response.status === 200) {
      console.log("Users list fetched");
      console.log(response.data.message);
      return response.data.userList;
    }
    //Failed!
    else if (response.status === 401) {
      console.log("No Users");
      console.log(response);
      return response.data.message;
    }
  } catch (error) {
    console.log("Failed to fetch users");
    console.log(error);
  }

  return;
};


/**
 * Sends a friend request
 * @param {*} requesterID ID of who is sending the request
 * @param {*} requesteeID ID of who the request is sent to
 * @returns list of users
 */
export const submitFriendRequest = async function (requesterID, requesteeID) {
  const body = {
    requesterID: requesterID,
    requesteeID: requesteeID
  };

  try {
    let response = await axios.post(ADD_FRIEND_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      console.log("Request sent");
      console.log(response.data.Message);
      return response.data.Message;
    }
    //Failed!
    else if (response.status === 401) {
      console.log(response.data.Message);
      return response.data.Message;
    }
  } catch (error) {
    console.log("Error sending request");
    console.log(error);
  }

  return;
};

/**
 * Gets all pending friend requests
 * @returns list of users
 */
export const getFriendRequests = async function () {
  const body = {
    currentUserID: getUserID(),
    status: "Pending"
  };

  try {
    let response = await axios.post(GET_FRIENDSHIPS_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      console.log("Request sent");
      console.log(response.data.Message);
      return response.data.friendships[0];
    }
    //Failed!
    else if (response.status === 401) {
      console.log(response.data.Message);
      return response.data.Message;
    }
  } catch (error) {
    console.log("Error sending request");
    console.log(error);
  }

  return;
};

/**
 * Gets all friends
 * @returns list of friends
 */
export const getFriends = async function () {
  const body = {
    currentUserID: getUserID(),
    status: "Active"
  };

  try {
    let response = await axios.post(GET_FRIENDSHIPS_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      console.log("Request sent");
      console.log(response.data.Message);
      return response.data.friendships[0];
    }
    //Failed!
    else if (response.status === 401) {
      console.log(response.data.Message);
      return response.data.Message;
    }
  } catch (error) {
    console.log("Error sending request");
    console.log(error);
  }

  return;
};