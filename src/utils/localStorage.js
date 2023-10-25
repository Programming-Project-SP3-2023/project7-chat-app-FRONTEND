/**
 * Client-side data storage handlers
 */

/**
 * Gets user data from session storage
 * @returns User data
 */
export const getUser = function () {
  const user = sessionStorage.getItem("user");
  if (user === "undefined" || !user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

/**
 * Sets user data in session storage
 * @param {*} user The user data to store
 */
export const setUserSession = function (user) {
  sessionStorage.setItem("user", JSON.stringify(user));
};

/**
 * Clears user data from session storage
 */
export const resetUserSession = async function () {
  sessionStorage.setItem("user", null);
  sessionStorage.removeItem("user");
};

/**
 * Gets user ID from session storage
 * @returns User ID
 */
export const getUserID = function () {
  const userID = sessionStorage.getItem("userID");
  if (userID === "undefined" || !userID) {
    return null;
  } else {
    return JSON.parse(userID);
  }
};

/**
 * Sets user ID in session storage
 * @param {*} userID The user ID to store
 */
export const setUserID = function (userID) {
  sessionStorage.setItem("userID", JSON.stringify(userID));
};

/**
 * Clears user ID from session storage
 */
export const resetUserID = async function () {
  sessionStorage.setItem("userID", null);
  sessionStorage.removeItem("userID");
};

/**
 * Gets access token from session storage
 * @returns Access token
 */
export const getAccessToken = function () {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken === "undefined" || !accessToken) {
    return null;
  } else {
    return JSON.parse(accessToken);
  }
};

/**
 * Sets access token in session storage
 * @param {*} accessToken The access token to store
 */
export const setAccessToken = function (accessToken) {
  sessionStorage.setItem("accessToken", JSON.stringify(accessToken));
};

/**
 * Clears access token from session storage
 */
export const resetTokenSession = async function () {
  sessionStorage.setItem("accessToken", null);
  sessionStorage.removeItem("accessToken");
};

/**
 * Gets selected side menu optionfrom session storage
 * @returns index
 */
export const getSideMenuOption = function () {
  const selected = sessionStorage.getItem("selectedOption");
  if (selected === "undefined" || !selected) {
    return null;
  } else {
    return JSON.parse(selected);
  }
};

/**
 * Sets user data in session storage
 * @param {*} selected The selected option number
 */
export const setSideMenuOption  = function (selected) {
  sessionStorage.setItem("selectedOption", JSON.stringify(selected));
};


/**
 * Gets groups and channels data from session storage
 * @returns Groups and Channels data
 */
export const getGroups = function () {
  const groups = sessionStorage.getItem("groups");
  if (groups === "undefined" || !groups) {
    return null;
  } else {
    return JSON.parse(groups);
  }
};

/**
 * Sets groups and channels data in session storage
 * @param {*} groups The user data to store
 */
export const setGroupsSession = function (groups) {
  sessionStorage.setItem("groups", JSON.stringify(groups));
};

/**
 * Clears groups and channels data from session storage
 */
export const resetGroupsSession = async function () {
  sessionStorage.setItem("groups", null);
  sessionStorage.removeItem("groups");
};
