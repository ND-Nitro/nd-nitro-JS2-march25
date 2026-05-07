import { API_SOCIAL_URL } from "../config/api.js";
import { getAccessToken, getApiKey } from "../utils/storage.js";

const POSTS_URL = `${API_SOCIAL_URL}/posts`;

/**
 * Create headers for requests
 */
function getHeaders(authRequired = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authRequired) {
    const accessToken = getAccessToken();
    const apiKey = getApiKey();

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    if (apiKey) {
      headers["X-Noroff-API-Key"] = apiKey;
    }
  }

  return headers;
}

/**
 * Handle API response
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

/**
 * Get all posts
 */
export async function getPosts() {
  const response = await fetch(`${POSTS_URL}?_author=true&_comments=true`, {
    method: "GET",
    headers: getHeaders(true),
  });

  const result = await handleResponse(response);
  return result.data;
}

/**
 * Get single post by ID
 */
export async function getPostById(id) {
  const response = await fetch(
    `${POSTS_URL}/${id}?_author=true&_comments=true&_reactions=true`,
    {
      method: "GET",
      headers: getHeaders(true),
    },
  );

  const result = await handleResponse(response);
  return result.data;
}

/**
 * Create new post
 */
export async function createPost(postData) {
  const response = await fetch(POSTS_URL, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(postData),
  });

  const result = await handleResponse(response);
  return result.data;
}

/**
 * Update post
 */
export async function updatePost(id, postData) {
  const response = await fetch(`${POSTS_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(postData),
  });

  const result = await handleResponse(response);
  return result.data;
}

/**
 * Delete post
 */
export async function deletePost(id) {
  const response = await fetch(`${POSTS_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });

  return handleResponse(response);
}

/**
 * Search posts
 */
export async function searchPosts(query) {
  const response = await fetch(
    `${POSTS_URL}/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: getHeaders(true),
    },
  );

  const result = await handleResponse(response);
  return result.data;
}

/** this will make sure that you can like another post..
 * i did get a little help  from chat gpt understand this function
 */

export async function reactToPost(id, symbol = "👍") {
  const response = await fetch(`${POSTS_URL}/${id}/react/${symbol}`, {
    method: "PUT",
    headers: getHeaders(true),
  });

  const result = await handleResponse(response);
  return result.data;
}
