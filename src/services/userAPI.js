/**
 * HTTP request handler for User-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const REGISTER_ENDPOINT = BASE_URL + "register";
const LOGIN_ENDPOINT = BASE_URL + "login";
const USER_INFO_ENDPOINT = BASE_URL + "profile/user-info";
const EDIT_DISPLAY_NAME_ENDPOINT = BASE_URL + "profile/edit-displayname";
const EDIT_EMAIL_ENDPOINT = BASE_URL + "profile/change-email";
const UPDATE_AVATAR_ENDPOINT = BASE_URL + "avatar/upload";

// Auth setup
const headers = {
  headers: {
    Authorization: getAccessToken(),
  },
};

/**
 * Register a new user
 */
export const register = async function (requestBody) {
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
export const getUserByID = async function (userID, token) {
  const requestBody = {
    AccountID: userID,
  };

  let loginHeaders = {
    headers: {
      Authorization: token,
    },
  };

  try {
    let response = await axios.get(
      USER_INFO_ENDPOINT,
      loginHeaders,
      requestBody
    );

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

/**
 * Updates a user's display name
 * @param {*} newDisplayName The new name we want to update to
 * @returns confirmation/error message
 */
export const updateDisplayName = async function (newDisplayName) {
  const requestBody = {
    newDisplayName: newDisplayName,
  };

  try {
    let response = await axios.put(
      EDIT_DISPLAY_NAME_ENDPOINT,
      requestBody,
      headers
    );

    //Success!
    if (response.status === 200) {
      // return success message
      return response.data.message;
    }
    //Failed!
    else {
      return response.data.message;
    }
  } catch (error) {
    console.log(error);
  }
  return;
};

/**
 * Updates a user's email
 * @param {*} newEmail The new name we want to update to
 * @returns confirmation/error message
 */
export const updateEmail = async function (newEmail) {
  const requestBody = {
    newEmail: newEmail,
  };

  try {
    let response = await axios.post(EDIT_EMAIL_ENDPOINT, requestBody, headers);

    //Success!
    if (response.status === 200) {
      // return success message
      console.log(response);
      return response.data.message;
    }
    //Failed!
    else {
      console.log(response);
      return response.data.message;
    }
  } catch (error) {
    console.log(error);
  }
  return;
};

/**
 * Uploads new avatar for a user
 * @param {*} avatarData The avatar we want to upload in Base64
 * @returns confirmation/error message
 */
export const updateAvatar = async function (avatarData) {
  console.log(avatarData, UPDATE_AVATAR_ENDPOINT);

  const requestBody = {
    avatarData: avatarData,
  };

  try {
    let response = await axios.post(
      UPDATE_AVATAR_ENDPOINT,
      requestBody,
      headers
    );

    //Success!
    if (response.status === 200) {
      // return success message
      console.log(response);
      return response.data.message;
    }
    //Failed!
    else {
      console.log(response);
      return response.data.message;
    }
  } catch (error) {
    console.log(error);
  }
  return;
};

/**
 * Get an avatar by id
 * @param {*} userID The user's id
 * @returns The user's avatar in Base64
 */
export const getAvatarByID = async function (userID, token) {
  console.log(`${BASE_URL}avatar/${userID}`);

  let avatarHeaders = {
    headers: {
      Authorization: token,
    },
  };

  try {
    let response = await axios.get(
      `${BASE_URL}avatar/${userID}`,
      avatarHeaders
    );

    //Success!
    if (response.status === 200) {
      console.log("Avatar found by id!");
      console.log(response.data);
      return response.data;
    }
    //Failed!
    else if (response.status === 204) {
      console.log("Failed to find avatar by id - 1");
      console.log(response);
      return response.data.message;
    }
  } catch (error) {
    console.log(error);
  }

  return;
};
