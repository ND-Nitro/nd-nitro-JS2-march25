import { getPosts, searchPosts, createPost } from "../api/posts.js";

const postsContainer = document.querySelector("#postsContainer");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const createPostForm = document.querySelector("#createPostForm");
const formMessage = document.querySelector("#formMessage");

function renderPosts(posts) {
  if (!postsContainer) return;

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  postsContainer.innerHTML = posts
    .map((post) => {
      return `
        <article class="post-card">
          <a href="/post.html?id=${post.id}">
            <h2>${post.title || "Untitled Post"}</h2>
          </a>
          <p>${post.body || ""}</p>
          ${
            post.media?.url
              ? `<img src="${post.media.url}" alt="${post.media.alt || post.title || "Post image"}">`
              : ""
          }
          <p><strong>Comments:</strong> ${post._count?.comments ?? 0}</p>
          <p><strong>Reactions:</strong> ${post._count?.reactions ?? 0}</p>
          ${
            post.author?.name
              ? `<p><strong>Author:</strong> ${post.author.name}</p>`
              : ""
          }
        </article>
      `;
    })
    .join("");
}

async function loadPosts() {
  try {
    const posts = await getPosts();
    renderPosts(posts);
  } catch (error) {
    if (postsContainer) {
      postsContainer.innerHTML = `<p>${error.message}</p>`;
    }

    console.error("Error loading posts:", error);
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput?.value.trim() || "";

    try {
      if (!query) {
        await loadPosts();
        return;
      }

      const posts = await searchPosts(query);
      renderPosts(posts);
    } catch (error) {
      if (postsContainer) {
        postsContainer.innerHTML = `<p>${error.message}</p>`;
      }
      console.error("Search error:", error);
    }
  });
}
if (createPostForm) {
  createPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#title")?.value.trim() || "";
    const body = document.querySelector("#body")?.value.trim() || "";
    const tagsValue = document.querySelector("#tags")?.value.trim() || "";
    const mediaUrl = document.querySelector("#mediaUrl")?.value.trim() || "";
    const mediaAlt = document.querySelector("#mediaAlt")?.value.trim() || "";

    const tags = tagsValue ? tagsValue.split(",").map((tag) => tag.trim()) : [];

    const postData = {
      title,
      body,
      tage,
    };

    if (mediaUrl) {
      postData.media = {
        url: mediaUrl,
        alt: mediaAlt,
      };
    }

    try {
      if (!title) {
        throw new Error("Title is rewuired.");
      }

      if (formMessage) {
        formMessage.textContent = "Creating post...";
      }

      await createPost(postData);

      if (formMessage) {
        formMessage.textContent = "Post created successfully.";
      }

      createPostForm.reset();
      await loadPosts();
    } catch (error) {
      if (formMessage) {
        formMessage.textContent = error.message;
      }

      console.error("Create post error:", error);
    }
  });
}

loadPosts();
