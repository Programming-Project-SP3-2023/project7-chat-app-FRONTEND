/**
 * HTTP request handler for User-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";

// base URL for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const REGISTER_ENDPOINT = BASE_URL + "register";
const LOGIN_ENDPOINT = BASE_URL + "login";
const USER_INFO_ENDPOINT = BASE_URL + "profile/user-info";

/**
 * Register a new user
 */
export const register = async function (requestBody) {
  console.log(BASE_URL);
  return await axios.post(REGISTER_ENDPOINT, requestBody);
};

/**
 * Log the user in
 */
export const login = async function (requestBody) {
  //Return promise for user login
  return await axios.post(LOGIN_ENDPOINT, requestBody);
};

/**
 * Get a user by id
 * @param {*} userID The user's id
 * @returns The user's data
 */
export const getUserByID = async function (userID) {
  
  const headers = {
    headers: {
      Authorization: getAccessToken(),
    },
  };

  const requestBody = {
    AccountID: userID,
  };

  try {
    let response = await axios.get(USER_INFO_ENDPOINT, headers, requestBody);

    //Success!
    if (response.status === 200) {
      console.log("User found by id!");
      console.log(response.data);
      return response.data;
    }
    //Failed!
    else {
      console.log("Failed to find user by id!");
      console.log(response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.log("Failed to find user by id!");
    console.log(error);
  }

  return;
};
