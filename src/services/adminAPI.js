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
