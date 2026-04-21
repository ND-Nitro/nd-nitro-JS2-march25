/**
 * This will save authentication data to LocalStorage and the params is.
 * @param {Object} data
 * @param {string} data.accessToken
 * @param {string} data.apiKey
 * @param {string} data.name
 * @param {string} data.email
 */

export function saveAuthData(data) {
  localStorage.setItem("accessToken", data.accessToken || "");
  localStorage.setItem("apiKey", data.apiKey || "");
  localStorage.setItem("userName", data.name || "");
  localStorage.setItem("userEmail", data.email || "");
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getApiKey() {
  return localStorage.getItem("apiKey");
}

export function getUserName() {
  return localStorage.getItem("userName");
}

export function getUserEmail() {
  return localStorage.getItem("userEmail");
}

export function clearAuthData() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("apiKey");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
}
