/**
 * HTTP request handler for Friends-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken, getUserID } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const ADD_FRIEND_ENDPOINT = BASE_URL + "friendships/request";
const GET_FRIENDSHIPS_ENDPOINT = BASE_URL + "friendships/friends";
const ACCEPT_FRIENDSHIP_ENDPOINT = BASE_URL + "friendships/accept";
const REMOVE_FRIENDSHIP_ENDPOINT = BASE_URL + "friendships/delete";

/**
 * Sends a friend request
 * @param {*} requesterID ID of who is sending the request
 * @param {*} requesteeID ID of who the request is sent to
 * @returns list of users
 */
export const submitFriendRequest = async function (requesterID, requesteeID) {
  const body = {
    requesterID: requesterID,
    requesteeID: requesteeID,
  };

  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.post(ADD_FRIEND_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      return response.data.Message;
    }
  } catch (error) {
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
    status: "Pending",
  };

  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.post(GET_FRIENDSHIPS_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      return response.data.friendships;
    }
    // No friend requests
    else if (response.status === 204) {
      return [];
    }
  } catch (error) {
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
    status: "Active",
  };

  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.post(GET_FRIENDSHIPS_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      return response.data.friendships;
    }
    //Failed!
    else if (response.status === 204) {
      return response.data.Message;
    }
  } catch (error) {
  }

  return;
};

/**
 * Accept a friend request
 * @param {*} requesterID ID of who is sending the request
 * @returns confirmation/error message
 */
export const acceptFriendRequest = async function (requesterID) {
  const body = {
    currentUserID: getUserID(),
    requesterID: requesterID,
  };

  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.put(ACCEPT_FRIENDSHIP_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      return response.data.Message;
    }
  } catch (error) {
  }

  return;
};

/**
 * Accept a friend request
 * @param {*} requesterID ID of who is sending the request
 * @returns confirmation/error message
 */
export const removeFriendOrRequest = async function (requesterID) {
  const body = {
    data: {
      currentUserID: getUserID(),
      OtherUserID: requesterID,
    },
  };

  try {
    let response = await axios.delete(REMOVE_FRIENDSHIP_ENDPOINT, body, {
      headers: {
        Authorization: getAccessToken(),
      },
    });

    //Success!
    if (response.status === 200) {
      return response.data.Message;
    }
  } catch (error) {
    
  }

  return;
};
