import { API_AUTH_URL } from "../config/api.js";
import { saveAuth } from "../utils/storage.js";

const REGISTER_URL = `${API_AUTH_URL}/register`;
const LOGIN_URL = `${API_AUTH_URL}/login`;
const API_KEY_URL = `${API_AUTH_URL}/create-api-key`;

/**
 *  this will Handle API response and throw useful errors
 * @param {Response} response
 * @param {Promise<any>}
 */

async function handleResponse(response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || "Something went wrong.");
  }

  return result;
}
/**
 * This is Register new user function
 */
export async function registerUser(userData) {
  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}
