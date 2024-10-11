const dashboard = document.getElementById("dashboard");
const menu = document.getElementById("menu");
const inventory = document.getElementById("inventory");
const signOut = document.getElementById("sign-out");
const tableCustomer = document.getElementById("table-customer");
const user = document.getElementById("user-login");

dashboard.addEventListener("click", () => openFile("dashboard"));
menu.addEventListener("click", () => openFile("menu"));
inventory.addEventListener("click", () => openFile("inventory"));

const loggedInUser = localStorage.getItem("loggedInUser");
user.innerHTML = `${loggedInUser}`;

signOut.addEventListener("click", function () {
  const confirmation = confirm("Are you sure you want to sign out?");
  if (confirmation) {
    document.body.innerHTML = `
    <div class="loader-container">
    <span class="loader"></span>
    <p class='text'>Signing out</p>
    </div>`;

    setTimeout(() => {
      window.location.href = "/login/index.html";
    }, 2500);
  }
});

const openFile = (file) => {
  document.body.innerHTML = `
  <div class="loader-container">
  <span class="loader"></span>
  <p class='text'>Opening ${file.charAt(0).toUpperCase() + file.slice(1)}</p>
  </div>`;

  setTimeout(() => {
    window.location.href = `/${file}/index.html`;
  }, 400);
};
const url = "https://66f70a80b5d85f31a341de97.mockapi.io/customers";
async function getCustomers() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Error fetching data");
    }
    const customers = await res.json();
    console.log(customers);

    tableCustomer.innerHTML = ` <table>
    <thead>
      <th>Id</th>
      <th>Name</th>
      <th>Surname</th>
      <th>Date Of Birth</th>
      <th>Year Old</th>
    </thead>
     <tbody id="products-tbody">
     </tbody>
    </table>`;
    const productsBody = document.getElementById("products-tbody");

    customers.forEach((customer) => {
      const row = `
       <tr>
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>${customer.surname}</td>
        <td>${customer.dateOfBirth}</td>
        <td>${customer.yearOld}</td>
      </tr>
      `;
      productsBody.innerHTML += row;
    });
  } catch (err) {
    console.log(err);
  }
}
getCustomers();

const hamburgerBtn = document.getElementById("hamburger-btn");
const nav = document.querySelector(".nav");
const hamburgerNav = document.querySelector(".hamburger");

hamburgerBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !hamburgerBtn.contains(event.target)) {
    nav.classList.remove("active"); // Hide navbar
  }
});