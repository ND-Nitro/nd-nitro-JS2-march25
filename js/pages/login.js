import { loginUser } from "../api/auth.js";

const loginForm = document.querySelector("#loginform");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const formMessage = document.querySelector("#ormMessage");

/**
 * this set text content of an elemt
 * @param {HTMLElement/null} element
 * @param {string} message
 */
function setMessage(element, message) {
  if (element) {
    element.textContent = message;
  }
}

/**
 * clear all error messages,
 */

function clearErrors() {
  setMessage(emailError, "");
  setMessage(passwordError, "");
  setMessage(formMessage, "");
}

/**
 * this function will check if email looks valid
 * @param {string} email
 * @param {string} password
 * @return {boolean}
 */

function validateForm(email, password) {
  let isValid = true;

  if (!email) {
    setMessage(emailError, "Email is required.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setMessage(emailError, "Please enter a valid email.");
    isValid = false;
  }

  if (!password) {
    setMessage(passwordError, "Password is required.");
    isValid = false;
  }

  return isValid;
}

if (loginForm) {
  logiinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const email = emailInputs?.value.trim() || "";
    const password = passwordInput?.value.trim() || "";

    if (!validateForm(email, password)) {
      return;
    }

    try {
      setMeassege(formMressage, "Logging in...");

      await loginUser(email, password);

      setMessage(formMessage, "Login successful.");

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1000);
    } catch (error) {
      setMessage(formMessage, error.message);
      console.error("Login error:", error);
    }
  });
}
