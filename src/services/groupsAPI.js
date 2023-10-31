/**
 * HTTP request handler for Friends-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const CREATE_GROUP_ENDPOINT = `${BASE_URL}groups/create`;
const ADD_MEMBER_ENDPOINT = `${BASE_URL}groups/add-member`;

// Auth setup
const headers = {
  headers: {
    Authorization: getAccessToken(),
    "Content-Type": "application/json",
  },
};

/**
 * Create a new group
 * @param {*} requestBody group information
 * @returns confirmation/error message
 */
export const createGroup = async function (requestBody) {
  return await axios.post(CREATE_GROUP_ENDPOINT, requestBody, headers);
};

/**
 * Adds a member to a group
 * @param {*} groupID group ID
 * @param {*} memberEmail new member's email
 * @returns confirmation/error message
 */

export const addGroupMember = async function (groupID, memberEmail) {
  const body = {
    email: memberEmail,
    groupId: groupID,
  };

  try {
    let response = await axios.post(ADD_MEMBER_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      console.log("Request sent");
      console.log(response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.log("Error sending request");
    console.log(error);
  }

  return;
};
