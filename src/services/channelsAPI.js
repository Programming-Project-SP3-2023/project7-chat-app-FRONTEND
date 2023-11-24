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

/*             Create Channel             */
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
      return response;
    }
  } catch (err) {
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
      return response.data;
    }
  } catch (err) {
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
      return response.data;
    }
  } catch (err) {
  }

  return;
};

/**
 * Updates a channel's name
 * @param {*} groupId group ID
 * @param {*} channelId channel ID
 * @param {*} newChannelName updated name for the channel
 * @returns confirmation/error message
 */
export const updateChannelName = async function (
  groupId,
  channelId,
  newChannelName
) {
  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const body = {
    channelId: channelId,
    newChannelName: newChannelName,
  };

  const UPDATE_CHANNEL_NAME_ENDPOINT = `${CHANNELS_BASE_ENDPOINT}${groupId}/channels/${channelId}/name`;

  try {
    const response = await axios.put(
      UPDATE_CHANNEL_NAME_ENDPOINT,
      body,
      headers
    );
    //Success!
    if (response.status === 200) {
      return response.data.message;
    }
  } catch (err) {
  }

  return;
};

/**
 * Adds new member to a channel
 * @param {*} groupId group ID
 * @param {*} channelId channel ID
 * @param {*} userIdToAdd member's Account ID
 * @returns confirmation/error message
 */
export const addChannelMember = async function (
  groupId,
  channelId,
  userIdToAdd
) {
  
  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };

  const body = {
    channelId: channelId,
    userIdToAdd: userIdToAdd,
  };
  //                                                              /groups/:groupId/channels/:channelId/members
  const ADD_MEMBER_CHANNEL_ENDPOINT = `${CHANNELS_BASE_ENDPOINT}${groupId}/channels/${channelId}/members`;

  try {
    const response = await axios.post(
      ADD_MEMBER_CHANNEL_ENDPOINT,
      body,
      headers
    );
    //Success!
    if (response.status === 200) {
      return response.data.message;
    }
  } catch (err) {
  }

  return;
};

/**
 * Removes member from a channel
 * @param {*} groupId group ID
 * @param {*} channelId channel ID
 * @param {*} userIdToRemove member's Account ID
 * @returns confirmation/error message
 */
export const removeChannelMember = async function (
  groupId,
  channelId,
  userIdToRemove
) {
  const headers = {
    headers: {
      Authorization: getAccessToken(),
    },
  };

  const REMOVE_MEMBER_CHANNEL_ENDPOINT = `${CHANNELS_BASE_ENDPOINT}${groupId}/channels/${channelId}/members/${userIdToRemove}`;

  try {
    const response = await axios.delete(
      REMOVE_MEMBER_CHANNEL_ENDPOINT,
      headers
    );
    //Success!
    if (response.status === 200) {
      return response.data.message;
    }
  } catch (err) {
  }

  return;
};

/**
 * Deletes a channel
 * @param {*} groupId group ID
 * @param {*} channelId channel ID
 * @returns confirmation/error message
 */
export const deleteChannel = async function (groupId, channelId) {
  const headers = {
    headers: {
      Authorization: getAccessToken(),
      "Content-Type": "application/json",
    },
  };


  const REMOVE_CHANNEL_ENDPOINT = `${CHANNELS_BASE_ENDPOINT}${groupId}/channels/${channelId}`;

  try {
    const response = await axios.delete(REMOVE_CHANNEL_ENDPOINT, headers);
    //Success!
    if (response.status === 200) {
      return response.data.message;
    }
  } catch (err) {
  }

  return;
};
