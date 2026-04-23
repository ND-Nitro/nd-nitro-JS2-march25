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

/**
 * here i create the API key  that is needed for authenticated users
 */

export async function createApiKey(accessToken) {
  const response = await fetch(API_KEY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: "JS2 Project Key",
    }),
  });

  const result = await handleResponse(response);
  return result.data?.key;
}

/**
 * this will Login user, create a API key and save auth data
 */

export async function loginUser(email, password) {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await handleResponse(response);

  const accessToken = result.data?.accessToken;
  const name = result.data?.name;
  const userEmail = result.data?.email;

  if (!accessToken) {
    throw new Error("Login succeeded, but no access token was returned.");
  }

  const apiKey = await createApiKey(accessToken);

  if (!apiKey) {
    throw new Error("API key was not returned.");
  }

  saveAuth({
    accessToken,
    apiKey,
    name,
    email: userEmail,
  });

  return result;
}
