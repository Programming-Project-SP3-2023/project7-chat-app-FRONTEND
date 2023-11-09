/**
 * HTTP request handler for Channels-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const CHANNELS_BASE_ENDPOINT = `${BASE_URL}channels/groups/`;

/**
 * Create a new channel
 * @param {*} groupId group ID
 * @param {*} channelType public/private
 * @param {*} visibility public/private
 * @param {*} channelName name of the channel
 * @returns confirmation/error message
 */
export const createChannel = async function (
  groupId,
  channelType,
  visibility,
  channelName
) {
  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const body = {
    groupId: groupId,
    channelType: channelType,
    visibility: visibility,
    channelName: channelName,
  };

  const CREATE_CHANNEL_ENDPOINT = `${CHANNELS_BASE_ENDPOINT}${groupId}/channels`;

  try {
    const response = await axios.post(CREATE_CHANNEL_ENDPOINT, body, headers);
    //Success!
    if (response.status === 201) {
      console.log("Channel Created!");
      console.log(response.data.message);
      return response.data.message;
    }
  } catch (err) {
    console.log(err);
  }

  return;
};
