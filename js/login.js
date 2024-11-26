const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

// Function to make loginBtn active
function setActiveLogin() {
  loginBtn.style.backgroundColor = "rgb(29, 142, 9)";
  loginBtn.style.color = "white";
  registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  registerBtn.style.color = "black";

  loginForm.style.left = "50%";
  registerForm.style.left = "-50%";

  loginForm.style.opacity = 1;
  registerForm.style.opacity = 0;
}

// Trigger loginBtn click event manually when the page loads
document.addEventListener("DOMContentLoaded", function () {
  setActiveLogin();
});

// Add event listeners for buttons
loginBtn.addEventListener("click", setActiveLogin);

registerBtn.addEventListener("click", () => {
  registerBtn.style.backgroundColor = "rgb(29, 142, 9)";
  registerBtn.style.color = "white";
  loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  loginBtn.style.color = "black";

  loginForm.style.left = "150%";
  registerForm.style.left = "50%";

  loginForm.style.opacity = 0;
  registerForm.style.opacity = 1;
});
