// Get elements
const dashboard = document.getElementById("dashboard");
const menu = document.getElementById("menu");
const customer = document.getElementById("customer");
const signOut = document.getElementById("sign-out");
const user = document.getElementById("user-login");
const productsbody = document.getElementById("products-tbody");
const searchBtn = document.getElementById("search-btn");
const datePicker = document.getElementById("date-picker");
const totalToday = document.getElementById("total-today");

// Navigation Events
dashboard.addEventListener("click", () => openFile("dashboard"));
menu.addEventListener("click", () => openFile("menu"));
customer.addEventListener("click", () => openFile("customer"));

// Display logged-in user
const loggedInUser = localStorage.getItem("loggedInUser");
user.innerHTML = `${loggedInUser}`;

// Sign Out Event
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

// Function to open different files
const openFile = (file) => {
  document.body.innerHTML = `
    <div class="loader-container">
      <span class="loader"></span>
      <p class='text'>Opening ${
        file.charAt(0).toUpperCase() + file.slice(1)
      }</p>
    </div>`;

  setTimeout(() => {
    window.location.href = `/${file}/index.html`;
  }, 400);
};

// Hamburger menu toggle
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

// Load all totals when the page loads
window.addEventListener("DOMContentLoaded", async () => {
  await fetchAndDisplayAllTotals();
});

searchBtn.addEventListener("click", async () => {
  const selectedDate = datePicker.value; // Get the date in YYYY-MM-DD format from the input
  if (selectedDate) {
    try {
      await fetchTotalByDate(selectedDate);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  } else {
    alert("Please select a date.");
  }
});
const selectP = document.getElementById("select");
const table = document.getElementById("table");

// Function to fetch and display all totals on page load
async function fetchAndDisplayAllTotals() {
  const url = "https://67076dd6a0e04071d22a3edc.mockapi.io/payments";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }

    const data = await response.json();
    productsbody.innerHTML = ""; // Clear previous entries

    let grandTotal = 0; // Initialize grand total

    data.forEach((item) => {
      // Add each item's total to the grandTotal
      grandTotal += parseFloat(item.total);

      const row = `
        <tr>
          <td>${item.date}</td>
          <td>$${item.total}</td>
        </tr>
      `;
      productsbody.innerHTML += row;
    });

    // Update total for all dates
    totalToday.innerHTML = `$${grandTotal.toFixed(2)}`;
    selectP.style.display = "none";
    table.style.display = "block";
  } catch (error) {
    console.error("Error fetching all totals:", error);
  }
}

// Function to fetch totals by selected date
async function fetchTotalByDate(date) {
  const url = "https://67076dd6a0e04071d22a3edc.mockapi.io/payments";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }

    const data = await response.json();

    // Filter the data to only include items with the selected date
    const filteredData = data.filter((item) => {
      const apiDate = item.date.split("T")[0]; // Adjust for API date format
      return apiDate === date;
    });

    // Clear previous results
    productsbody.innerHTML = "";

    if (filteredData.length > 0) {
      // Display each matching record in the table
      filteredData.forEach((item) => {
        const row = `
          <tr>
            <td>${item.date}</td>
            <td>$${item.total}</td>
          </tr>
        `;
        productsbody.innerHTML += row;
      });

      const totalForDate = filteredData.reduce(
        (sum, item) => sum + parseFloat(item.total),
        0
      );

      // Display total for selected date
      totalToday.innerHTML = `$${totalForDate.toFixed(2)}`;

      // Hide message and show table
      selectP.style.display = "none";
      table.style.display = "block";
    } else {
      // Show message if no totals found for selected date
      selectP.style.display = "block";
      table.style.display = "none";
      selectP.innerHTML = `No totals found for ${date}`;
      totalToday.innerHTML = "$0.00";
    }
  } catch (error) {
    console.error("Error fetching and filtering data:", error);
  }
}
