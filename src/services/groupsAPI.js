/**
 * HTTP request handler for Groups-related endpoints
 */

// imports
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";

// base URLs for API requests
const BASE_URL = process.env.REACT_APP_BASEURL;
const CREATE_GROUP_ENDPOINT = `${BASE_URL}groups/create`;
const ADD_MEMBER_ENDPOINT = `${BASE_URL}groups/add-member`;
const GET_MEMBERS_ENDPOINT = `${BASE_URL}groups/current-groups`;
const REMOVE_MEMBER_ENDPOINT = `${BASE_URL}groups/remove-member`;

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

  const myHeaders = {
    headers: {
      Authorization: getAccessToken(),
    },
  };

  return await axios.post(CREATE_GROUP_ENDPOINT, requestBody, myHeaders);
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

export const getGroupIDs = async function (token) {
  const getGroupsHeader = {
    headers: {
      Authorization: `${token ? token : getAccessToken()}`,
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.get(GET_MEMBERS_ENDPOINT, getGroupsHeader);

    //Success!
    if (response.status === 200) {
      console.log("Group IDs fetched.");
      console.log(response.data.groupIds);
      return response.data.groupIds;
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
export const getGroupByID = async function (groupID, token) {
  console.log(`${BASE_URL}groups/${groupID}`);

  const getGroupsHeader = {
    headers: {
      Authorization: `${token ? token : getAccessToken()}`,
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.get(
      `${BASE_URL}groups/${groupID}`,
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
 * @param {*} groupID group ID
 * @returns confirmation/error message
 */

export const deleteGroupByID = async function (groupID, token) {
  console.log(`${BASE_URL}groups/delete/${groupID}`);

  const deleteHeader = {
    headers: {
      Authorization: `${token ? token : getAccessToken()}`,
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.delete(
      `${BASE_URL}groups/delete/${groupID}`,
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
 * @param {*} accountId user ID
 * @returns confirmation/error message
 */
export const removeGroupMember = async function (groupId, accountId) {
  const body = {
    accountId: accountId,
    groupId: groupId,
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
      REMOVE_MEMBER_ENDPOINT,
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

/**
 * Updates a group's name
 * @param {*} groupID group ID
 * @param {*} groupName new name
 * @returns confirmation/error message
 */

export const updateGroupName = async function (groupID, groupName) {
  console.log(`${BASE_URL}groups/edit-name/${groupID}`);
  const body = {
    newGroupName: groupName
  };

  try {
    let response = await axios.post(`${BASE_URL}groups/edit-name/${groupID}`, body, headers);

    //Success!
    if (response.status === 200) {
      console.log("Group name updated");
      console.log(response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.log("Error updating group name");
    console.log(error);
  }

  return;
};


/**
 * Updates a group's name
 * @param {*} groupID group ID
 * @param {*} groupAvatar new avatar
 * @returns confirmation/error message
 */

export const updateGroupAvatar = async function (groupID, groupAvatar) {
  const body = {
    groupId: groupID,
    avatarData: groupAvatar
  };

  try {
    let response = await axios.post(`${BASE_URL}avatar/upload-group-avatar`, body, headers);

    //Success!
    if (response.status === 200) {
      console.log("Group avatar updated");
      console.log(response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.log("Error updating group avatar");
    console.log(error);
  }

  return;
};