import { getPostById, updatePost } from "../api/posts.js";
import { getUserName } from "../utils/storage.js";

const editPostForm = document.querySelector("#editPostForm");
const messageElement = document.querySelector("#message");

const titleInput = document.querySelector("#title");
const bodyInput = document.querySelector("#body");
const tagsInput = document.querySelector("#tags");
const mediaUrlInput = document.querySelector("#mediaUrl");
const mediaAltInput = document.querySelector("#mediaAlt");

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function setMessage(message) {
  if (messageElement) {
    messageElement.textContent = message;
  }
}

async function loadPostIntoForm() {
  const id = getPostId();

  if (!id) {
    setMessage("Post ID is missing.");
    return;
  }

  try {
    const post = await getPostById(id);

    const currentUser = getUserName();

    if (post.author?.name !== currentUser) {
      setMessage("You can only edit your own posts.");
      if (editPostForm) {
        editPostForm.style.display = "none";
      }
      return;
    }

    titleInput.value = post.title || "";
    bodyInput.value = post.body || "";
    tagsInput.value = post.tags ? post.tags.join(", ") : "";
    mediaUrlInput.value = post.media?.url || "";
    mediaAltInput.value = post.media?.alt || "";
  } catch (error) {
    setMessage(error.message);
    console.error("Load edit post error:", error);
  }
}

if (editPostForm) {
  editPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = getPostId();

    if (!id) {
      setMessage("Post ID is missing.");
      return;
    }

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    const tagsValue = tagsInput.value.trim();
    const mediaUrl = mediaUrlInput.value.trim();
    const mediaAlt = mediaAltInput.value.trim();

    if (!title) {
      setMessage("Title is required.");
      return;
    }

    const tags = tagsValue ? tagsValue.split(",").map((tag) => tag.trim()) : [];

    const postData = {
      title,
      body,
      tags,
    };

    if (mediaUrl) {
      postData.media = {
        url: mediaUrl,
        alt: mediaAlt,
      };
    }

    try {
      setMessage("Saving changes...");

      await updatePost(id, postData);

      setMessage("Post updated successfully.");

      setTimeout(() => {
        window.location.href = `./post.html?id=${id}`;
      }, 1000);
    } catch (error) {
      setMessage(error.message);
      console.error("Update post error:", error);
    }
  });
}

loadPostIntoForm();
