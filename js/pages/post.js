import { getPostById, deletePost, reactToPost } from "../api/posts.js";

import { getUserName } from "../utils/storage.js";

const postContainer = document.querySelector("#postContainer");
const messageElement = document.querySelector("#message");

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderPost(post) {
  if (!postContainer) return;

  const currentUser = getUserName();
  const isOwner = post.author?.name === currentUser;

  postContainer.innerHTML = `
  <article class="post-card">
    <h1>${post.title || "Untitled post"}</h1>

    <p>${post.body || ""}</p>

    ${
      post.media?.url
        ? `<img src="${post.media.url}" alt="Post media" class="post-media">`
        : ""
    }

    <p><strong>Author:</strong> ${post.author?.name || "Unknown"}</p>

    <p><strong>Comments:</strong> ${post._count?.comments ?? 0}</p>

    <p>
      <strong>Reactions:</strong>
      ${post._count?.reactions ?? 0}
    </p>

    <button id="likeBtn" type="button">
      👍 Like
    </button>

    ${
      isOwner
        ? `
      <div class="post-actions">
        <a class="action-btn" href="./edit.html?id=${post.id}">
          Edit
        </a>

        <button id="deletePostBtn" type="button">
          Delete
        </button>
      </div>
      `
        : ""
    }
  </article>
  `;

  const likeButton = document.querySelector("#likeBtn");

  if (likeButton) {
    likeButton.addEventListener("click", async () => {
      try {
        await reactToPost(post.id);

        await loadPost();
      } catch (error) {
        if (messageElement) {
          messageElement.textContent = error.message;
        }

        console.error("Reaction error:", error);
      }
    });
  }

  const deleteButton = document.querySelector("#deletePostBtn");

  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete this post?");

      if (!confirmed) return;

      try {
        await deletePost(post.id);

        window.location.href = "./index.html";
      } catch (error) {
        if (messageElement) {
          messageElement.textContent = error.message;
        }

        console.error("Delete post error:", error);
      }
    });
  }
}

async function loadPost() {
  const id = getPostId();

  if (!id) {
    if (postContainer) {
      postContainer.innerHTML = "<p>Post ID is missing.</p>";
    }

    return;
  }

  try {
    const post = await getPostById(id);

    renderPost(post);
  } catch (error) {
    if (messageElement) {
      messageElement.textContent = error.message;
    }

    console.error("Load post error:", error);
  }
}

loadPost();
