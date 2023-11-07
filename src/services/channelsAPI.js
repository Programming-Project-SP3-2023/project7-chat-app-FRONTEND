/**
 * HTTP request handler for Friends-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
//TODO set end points
const CREATE_CHANNEL_ENDPOINT = `${BASE_URL}groups/create`;
const ADD_CHANNEL_MEMBER_ENDPOINT = `${BASE_URL}groups/add-member`;
const GET_CHANNEL_MEMBERS_ENDPOINT = `${BASE_URL}groups/current-groups`;
const REMOVE_CHANNEL_MEMBER_ENDPOINT = `${BASE_URL}groups/remove-member`;

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
export const createChannel = async function (requestBody) {
  const myHeaders = {
    headers: {
      Authorization: getAccessToken(),
    },
  };

  console.log("HI!:", myHeaders);
  console.log("HO: ", requestBody);
  //   asumption that the request body would contain groupID, channeName & messagetype(text/voice)
  return await axios.post(CREATE_CHANNEL_ENDPOINT, requestBody, myHeaders);
};

/**
 * Adds a member to a group
 * @param {*} groupID group ID
 * @param {*} memberEmail new member's email
 * @returns confirmation/error message
 */

export const addChannelMember = async function (groupID, memberEmail) {
  const body = {
    email: memberEmail,
    groupId: groupID,
  };

  try {
    let response = await axios.post(ADD_CHANNEL_MEMBER_ENDPOINT, body, headers);

    //Success!
    if (response.status === 200) {
      console.log("Member added");
      console.log(response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.log("Error adding member");
    console.log(error);
  }

  return;
};

/**
 * Gets a list of group IDs the user is part of
 * @returns an array of group IDs
 */
// TODO
export const getChannelIDs = async function (token) {
  const getGroupsHeader = {
    headers: {
      Authorization: `${token ? token : getAccessToken()}`,
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.get(
      GET_CHANNEL_MEMBERS_ENDPOINT,
      getGroupsHeader
    );

    //Success!
    if (response.status === 200) {
      console.log("Channel IDs fetched.");
      console.log(response.data.channelIDs);
      return response.data.channelIDs;
    }
  } catch (error) {
    console.log("Error sending request");
    console.log(error);
  }

  return;
};

/**
 * Get a group info by id
 * @param {*} groupID The group's id
 * @returns The group's info
 */
export const getChannelbyID = async function (groupID, channelID, token) {
  console.log(`${BASE_URL}groups/${groupID}/${channelID}`);

  const getGroupsHeader = {
    headers: {
      Authorization: `${token ? token : getAccessToken()}`,
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.get(
      `${BASE_URL}groups/${groupID}/${channelID}`,
      getGroupsHeader
    );

    //Success!
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return;
};

/**
 * Deletes a group
 * @param {*} channelID channel ID and group id?
 * @returns confirmation/error message
 */

export const deleteChannelByID = async function (groupID, channelID, token) {
  console.log(`${BASE_URL}groups/delete/${groupID}/${channelID}`);

  const deleteHeader = {
    headers: {
      Authorization: `${token ? token : getAccessToken()}`,
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.delete(
      `${BASE_URL}groups/delete/${groupID}/${channelID}`,
      deleteHeader
    );

    //Success!
    if (response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    console.log(error);
  }

  return;
};

/**
 * Removes a group member
 * @param {*} groupId group ID
 * @param {*} channelId channel
 * @param {*} accountId user ID
 * @returns confirmation/error message
 */
export const removeChannelMember = async function (
  groupId,
  channelId,
  accountId
) {
  const body = {
    accountId: accountId,
    groupId: groupId,
    channelId: channelId,
  };

  const deleteHeaders = {
    headers: {
      Authorization: getAccessToken(),
    },
  };

  console.log("Headers, ", deleteHeaders);
  console.log("Body, ", body);

  try {
    let response = await axios.post(
      REMOVE_CHANNEL_MEMBER_ENDPOINT,
      body,
      deleteHeaders
    );

    //Success!
    if (response.status === 200) {
      return response.data.message;
    }
  } catch (error) {
    console.log(error);
  }

  return;
};
