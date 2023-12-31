/**
 * HTTP request handler for Admin-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const ADMIN_BASE_ENDPOINT = `${BASE_URL}admin/`;

/**
 * Log the admin user in
 */
export const adminLogin = async function (requestBody) {
  const ADMIN_LOGIN_ENDPOINT = `${ADMIN_BASE_ENDPOINT}login`;
  //Return promise for user login
  return await axios.post(ADMIN_LOGIN_ENDPOINT, requestBody);
};

/**
 * Gets a list of all users
 * @returns a list of users
 */

export const getAccounts = async function () {
  const header = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const ADMIN_GET_USERS_ENDPOINT = `${ADMIN_BASE_ENDPOINT}accounts`;

  try {
    let response = await axios.get(ADMIN_GET_USERS_ENDPOINT, header);

    //Success!
    if (response.status === 200) {
      return response.data.userList[0];
    }
  } catch (error) {
  }

  return;
};

/**
 * Updates a user's account data
 * @param {*} requestBody new user object with all fields
 * @returns confirmation/error message
 */
export const updateAccount = async function (requestBody) {
  const header = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const ADMIN_UPDATE_USER_ENDPOINT = `${ADMIN_BASE_ENDPOINT}update`;

  try {
    let response = await axios.put(
      ADMIN_UPDATE_USER_ENDPOINT,
      requestBody,
      header
    );

    //Success!
    if (response.status === 200) {
      // return success message
      return response.data.Message;
    }
  } catch (error) {
  }
  return;
};

/**
 * Deletes a user account
 * @param {*} AccountID ID of the user to delete
 * @returns true if successful, false if failed
 */
export const deleteAccount = async function (AccountID) {
  const REMOVE_ACCOUNT_ENDPOINT = `${ADMIN_BASE_ENDPOINT}delete`;

  try {
    const response = await axios.delete(REMOVE_ACCOUNT_ENDPOINT, {
      headers: {
        Authorization: getAccessToken(),
      },
      data: { AccountID: AccountID },
    });
    //Success!
    if (response.status === 200) {
      return true;
    }
  } catch (err) {
  }

  return false;
};

/**
 * Updates a user's password
 * @param {*} AccountID the ID of the account in question
 * @param {*} password the new password
 * @returns confirmation/error message
 */
export const updatePassword = async function (AccountID, password) {
  const header = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const requestBody = {
    AccountID: AccountID,
    password: password,
  };

  const ADMIN_UPDATE_PWD_ENDPOINT = `${ADMIN_BASE_ENDPOINT}changePassword`;

  try {
    let response = await axios.put(
      ADMIN_UPDATE_PWD_ENDPOINT,
      requestBody,
      header
    );

    //Success!
    if (response.status === 200) {
      // return success message
      return response.data.Message;
    }
  } catch (error) {
  }
  return;
};
