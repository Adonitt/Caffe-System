const btn = document.getElementById("login-btn");
const userAlert = document.getElementById("username-alert");
const pwAlert = document.getElementById("pwAlert");
const usernameInput = document.getElementById("user-nameInp");
const passwordInput = document.getElementById("inpPassword");

const users = [
  { user1: "admin", pw1: "admin" },
  { user2: "admin1", pw2: "admin1" },
  { user3: "admin12", pw3: "admin12" },
];

btn.addEventListener("click", function (event) {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  let isValidUser = false;

  users.forEach((user) => {
    if (
      (user.user1 && user.user1 === username && user.pw1 === password) ||
      (user.user2 && user.user2 === username && user.pw2 === password) ||
      (user.user3 && user.user3 === username && user.pw3 === password)
    ) {
      isValidUser = true;
    }
  });

  if (!username) {
    userAlert.innerHTML = "Username field should not be empty";
  } else {
    userAlert.innerHTML = "";
  }
  if (!password) {
    pwAlert.innerHTML = "Password field should not be empty";
  } else if (isValidUser) {
    // alert(`Login successful! Welcome ${username}`);
    userAlert.innerHTML = "";
    pwAlert.innerHTML = "";
    usernameInput.value = "";
    passwordInput.value = "";
    document.body.innerHTML = `<span class="loader"></span><br>
                               <p class='text'>Signing in as ${username}</p>`;

    localStorage.setItem("loggedInUser", username);

    setTimeout(() => {
      window.location.href = "/dashboard/index.html";
    }, 2500);
  } else {
    userAlert.innerHTML = "Invalid Username or Password";
    pwAlert.innerHTML = "";
  }
});
