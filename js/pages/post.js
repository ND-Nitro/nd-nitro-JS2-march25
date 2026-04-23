import { API_SOCIAL_URL } from "../config/api";
import { getAccessToken, getApiKey } from "../utils/storage.js";

const POSST_URL = `${API_SOCIAL_URL}/posts`;

function getHeaders(authRequired = false) {
  const headers = {
    "Content-type": "application/json",
  };

  if (authRequired) {
    const accessToken = getAccessToken();
    const apiKey = getApiKey();

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    if (apiKey) {
      headers["x-Noroff-Api-Key"] = apiKey;
    }
  }

  return headers;
}

/** this handle API response and throws useful errors
 * @param {Response} response
 * @returns {Promise<any>}
 */

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || "Something went wrong.");
  }

  return result;
}

/** this is getting all the posts.
 * @param {Promise<any[]>}
 * @returns {}
 */

export async function getPosts() {
  const response = await fetch(`${POSTS_URL}?_author=true&_comments=true`, {
    method: "GET",
    headers: getHeaders(true),
  });

  const result = await handleResponse(response);
  return result.data;
}
