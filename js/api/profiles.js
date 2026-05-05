import { API_SOCIAL_URL } from "../config/api.js";
import { getAccessToken, getApiKey } from "../utils/storage.js";

const PROFILES_URL = `${API_SOCIAL_URL}/profiles`;

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

async function handleResponse(response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || "Something went wrong.");
  }

  return result;
}

export async function getProfile(name) {
  const response = await fetch(
    `${PROFILES_URL}/${encodeURIComponent(name)}?_followers=true&_following=true&_posts=true`,
    {
      method: "GET",
      headers: getHeaders(true),
    },
  );

  const result = await handleResponse(response);
  return result.data;
}

export async function getPostsByProfile(name) {
  const response = await fetch(
    `${PROFILES_URL}/${encodeURIComponent(name)}/posts?_author=true&_comments=true&_reactions=true`,
    {
      method: "GET",
      headers: getHeaders(true),
    },
  );

  const result = await handleResponse(response);
  return result.data;
}

export async function updateProfile(name, profileData) {
  const response = await fetch(`${PROFILES_URL}/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(profileData),
  });

  const result = await handleResponse(response);
  return result.data;
}

export async function followProfile(name) {
  const response = await fetch(
    `${PROFILES_URL}/${encodeURIComponent(name)}/follow`,
    {
      method: "PUT",
      headers: getHeaders(true),
    },
  );

  const result = await handleResponse(response);
  return result.data;
}

export async function unfollowProfile(name) {
  const response = await fetch(
    `${PROFILES_URL}/${encodeURIComponent(name)}/unfollow`,
    {
      method: "PUT",
      headers: getHeaders(true),
    },
  );

  const result = await handleResponse(response);
  return result.data;
}
