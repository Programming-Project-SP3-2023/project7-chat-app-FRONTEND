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

/**
 * Gets all channels IDs and their visibility settings for a group
 * @param {*} groupId group ID
 * @returns List of channels IDs and their visibility settings
 */
export const getChannels = async function (groupId) {
  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const GET_CHANNELS_ENDPOINT = `${CHANNELS_BASE_ENDPOINT}${groupId}/channels`;

  try {
    const response = await axios.get(GET_CHANNELS_ENDPOINT, headers);
    //Success!
    if (response.status === 200) {
      console.log("Channels fetched!");
      return response.data;
    }
  } catch (err) {
    console.log(err);
  }

  return;
};

/**
 * Gets information about a channel and its members
 * @param {*} groupId group ID
 * @param {*} channelId channel ID
 * @returns Channel info and list of members
 */
export const getChannelInfo = async function (groupId, channelId) {
  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const GET_CHANNEL_INFO_ENDPOINT = `${CHANNELS_BASE_ENDPOINT}${groupId}/channels/${channelId}`;

  try {
    const response = await axios.get(GET_CHANNEL_INFO_ENDPOINT, headers);
    //Success!
    if (response.status === 200) {
      console.log("Channel Info fetched!");
      return response.data;
    }
  } catch (err) {
    console.log(err);
  }

  return;
};
