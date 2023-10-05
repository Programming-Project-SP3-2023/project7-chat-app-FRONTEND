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
