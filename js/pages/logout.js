import { clearAuthData } from "../utils/storage.js";

const logoutButton = document.querySelector("#logoutBtn");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    clearAuthData();

    alert("You have been logged out.");

    window.location.href = "./login.html";
  });
}
