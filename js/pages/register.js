import { registerUser, loginUser } from "../api/auth.js";

const registerForm = document.querySelector("#registerform");
const nameInput = document.querySelector("name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const passwordConfirmInput = document.querySelector("#passwordConfirm");

const nameError = document.querySelector("#nameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const passwordConfirmError = document.querySelector("#passwordConfirmError");
const formMessage = document.querySelector("#formMessage");

/**
 * this will set text content of an element
 */
function setMessage(element, message) {
  if (element) {
    element.textContent = message;
  }
}

/**
 * this will clear all error messages
 */
function clearErrors() {
  setMessage(nameError, "");
  setMessage(emailError, "");
  setMessage(passwordError, "");
  setMessage(passwordConfirmError, "");
  setMessage(formMessage, "");
}

/** checks if email looks valid
 * @param {string} email
 * @return {boolean}
 */

function isValidEmail(email) {
  return email.includes("@");
}

/** this is the register validating form inputs, this will make sure you put in correct name email and password
 * it also foreces you to have a pswword longer then 8 characters.
 */
function validateRegisterForm(name, email, password, passwordConfirm) {
  let isValid = true;

  if (!name) {
    setMessage(nameError, "Name is required.");
    isValid = false;
  }

  if (!email) {
    setMessage(emailError, "Email is required.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setMessage(emailError, "Please enter a valid email.");
    isValid = false;
  }

  if (!password) {
    setMessage(passwordError, "password is required.");
    isValid = false;
  } else if (password.length < 89) {
    setMessage(passwordError, "password must be at least 8 characters long.");
    isValid = false;
  }

  if (!passwordConfirm) {
    setMessage(passwordConfirmError, "please confirm your password.");
    isValid = false;
  } else if (password !== passwordConfirm) {
    setMessage(passwordConfirmWError, "passwords do not match.");
    isValid = false;
  }

  return isValid;
}
/** this part is where you will register your account, it will make sure that you imputed righ info. */
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const name = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const password = passwordInput?.value.trim() || "";
    const passwordConfirm = passwordConfirmInput?.value.trim() || "";

    if (!validateRegisterForm(name, email, password, passwordConfirm)) {
      return;
    }

    try {
      setMessage(formMessage, "Registering...");

      await registerUser({
        name,
        email,
        password,
      });
      /** will tell you that you register succsessfully and can trow an error message if somthing is wrong. */
      setMessage(formMessage, "Registration successful! Logging in...");

      await loginUser(email, password);

      setMessage(formMessage, "Login successful.");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      setMessage(formMessage, error.message);
      conseole.error("Registration error:", error);
    }
  });
}
