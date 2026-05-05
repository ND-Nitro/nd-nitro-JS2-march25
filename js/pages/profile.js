import {
  getProfile,
  getPostsByProfile,
  followProfile,
  unfollowProfile,
} from "../api/profiles.js";

import { getUserName } from "../utils/storage.js";

const profileContainer = document.querySelector("#profileContainer");
const profilePostsContainer = document.querySelector("#profilePostsContainer");
const messageElement = document.querySelector("#message");

function getProfileNameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("name");
}

function renderProfile(profile) {
  if (!profileContainer) return;

  const currentUser = getUserName();
  const isOwnProfile = profile.name === currentUser;

  const followers = profile.followers || [];
  const isFollowing = followers.some(
    (follower) => follower.name === currentUser,
  );

  profileContainer.innerHTML = `
    <section class="profile-card">
      ${
        profile.banner?.url
          ? `<img src="${profile.banner.url}" alt="${profile.banner.alt || "Profile banner"}">`
          : ""
      }

      ${
        profile.avatar?.url
          ? `<img src="${profile.avatar.url}" alt="${profile.avatar.alt || "Profile avatar"}">`
          : ""
      }

      <h1>${profile.name}</h1>
      <p>${profile.bio || "No bio yet."}</p>

      <p><strong>Posts:</strong> ${profile._count?.posts ?? 0}</p>
      <p><strong>Followers:</strong> ${profile._count?.followers ?? 0}</p>
      <p><strong>Following:</strong> ${profile._count?.following ?? 0}</p>

      ${
        !isOwnProfile
          ? `<button id="followBtn" type="button">
              ${isFollowing ? "Unfollow" : "Follow"}
            </button>`
          : ""
      }
    </section>
  `;

  const followBtn = document.querySelector("#followBtn");

  if (followBtn) {
    followBtn.addEventListener("click", async () => {
      try {
        if (isFollowing) {
          await unfollowProfile(profile.name);
        } else {
          await followProfile(profile.name);
        }

        await loadProfilePage();
      } catch (error) {
        if (messageElement) {
          messageElement.textContent = error.message;
        }

        console.error("Follow error:", error);
      }
    });
  }
}

function renderProfilePosts(posts) {
  if (!profilePostsContainer) return;

  if (!posts || posts.length === 0) {
    profilePostsContainer.innerHTML = "<p>No posts from this user yet.</p>";
    return;
  }

  profilePostsContainer.innerHTML = posts
    .map((post) => {
      return `
        <article class="post-card">
          <a href="./post.html?id=${post.id}">
            <h2>${post.title || "Untitled post"}</h2>
          </a>

          <p>${post.body || ""}</p>

          ${
            post.media?.url
              ? `<img src="${post.media.url}" alt="${post.media.alt || post.title || "Post image"}">`
              : ""
          }

          <p><strong>Comments:</strong> ${post._count?.comments ?? 0}</p>
          <p><strong>Reactions:</strong> ${post._count?.reactions ?? 0}</p>
        </article>
      `;
    })
    .join("");
}

async function loadProfilePage() {
  const profileName = getProfileNameFromUrl() || getUserName();

  if (!profileName) {
    if (profileContainer) {
      profileContainer.innerHTML =
        "<p>You must be logged in to view your profile.</p>";
    }
    return;
  }

  try {
    const profile = await getProfile(profileName);
    const posts = await getPostsByProfile(profileName);

    renderProfile(profile);
    renderProfilePosts(posts);
  } catch (error) {
    if (messageElement) {
      messageElement.textContent = error.message;
    }

    console.error("Profile page error:", error);
  }
}

loadProfilePage();
