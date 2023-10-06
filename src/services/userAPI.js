/**
 * HTTP request handler for User-related endpoints
 */

// imports
import axios from "axios";

// base URL for API requests
// const BASE_URL = process.env.REACT_APP_BASEURL;
const BASE_URL = "http://localhost:4000/";
const REGISTER_ENDPOINT = BASE_URL + "register";
const LOGIN_ENDPOINT = BASE_URL + "login";

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
