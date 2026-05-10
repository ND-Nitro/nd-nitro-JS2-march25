import { clearAuthData, getAccessToken } from "../utils/storage.js";

const logoutButton = document.querySelector("#logoutBtn");
const loginLink = document.querySelector("#loginLink");
const registerLink = document.querySelector("#registerLink");
const profileLink = document.querySelector("#profileLink");

const isLoggedIn = Boolean(getAccessToken());

if (logoutButton) {
  logoutButton.style.display = isLoggedIn ? "inline-flex" : "none";
}

if (loginLink) {
  loginLink.style.display = isLoggedIn ? "none" : "inline";
}

if (registerLink) {
  registerLink.style.display = isLoggedIn ? "none" : "inline";
}

if (profileLink) {
  profileLink.style.display = isLoggedIn ? "inline" : "none";
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    clearAuthData();
    window.location.href = "./login.html";
  });
}
