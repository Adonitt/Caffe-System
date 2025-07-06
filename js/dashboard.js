const username = document.getElementById("user-login");
const productsDiv = document.getElementById("products");
const invoiceTable = document.getElementById("invoice-table");
const signOut = document.getElementById("sign-out");
const foodsBtn = document.getElementById("foods");
const drinksBtn = document.getElementById("drinks");
const dessertsBtn = document.getElementById("desserts");
const selectP = document.getElementById("select");
const clearBtn = document.getElementById("clear");
const totalSpan = document.getElementById("total");
const amountInp = document.getElementById("amount");
const chargeBtn = document.getElementById("charge-btn");
const checkCharge = document.getElementById("charge");
const payBtn = document.getElementById("pay");
const payMsg = document.getElementById("pay-message");
const invoiceBtn = document.getElementById("show-invoice");
const modal = document.getElementById("invoiceModal");
const closeModal = document.createElement("span");
const menu = document.getElementById("menu");
const customer = document.getElementById("customer");
const inventory = document.getElementById("inventory");

const loggedInUser = localStorage.getItem("loggedInUser");
username.innerHTML = `${loggedInUser}`;

let products = [];
let apiData = [];

async function getProducts(apiUrl) {
  try {
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw new Error("Error fetching api data");
    }

    apiData = await apiResponse.json();

    productsDiv.innerHTML = "";
    productsDiv.classList.add("products");

    apiData.forEach((product, index) => {
      productsDiv.innerHTML += `
        <div class="pr1" id="pr1-api-${index}">
          <div class="d-name-price">
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price}</span>
          </div>
          <img src="${product.img}" width="150px" height="100px" alt="" />
          <div class="qty-btn">
            <input
              type="number"
              class="qty"
              id="qty-api-${index}"
              placeholder="Write Quantity"
            />
            <button class="add-btn" data-index="api-${index}" style="background-color:rgb(96, 184, 96); border-radius:5px; border:none;">Add</button>
          </div>
        </div>
      `;
    });
    document.querySelectorAll(".add-btn").forEach((button, index) => {
      button.addEventListener("click", () => {
        const product = apiData[index]; // Get product from apiData
        const qty = document.getElementById(`qty-api-${index}`).value;

        if (qty > 0) {
          addToTable(product.name, qty, product.price);
        } else {
          alert("Please enter a valid quantity");
        }
      });
    });
  } catch (error) {
    console.error(error.message);
  }
}

document.querySelectorAll(".add-btn").forEach((button) => {
  //shkon per secilin buton me klasen add
  button.addEventListener("click", () => {
    // per secilen here qe klikohet
    const index = button.getAttribute("data-index"); // e merr atributin e butonit
    const productName = products[index].name;
    const productPrice = products[index].price;
    const qty = document.getElementById(`qty-${index}`).value;

    if (qty > 0) {
      addToTable(productName, qty, productPrice);
    } else {
      alert("Please enter a valid quantity");
    }
  });
});

const invoiceItems = [];

function addToTable(name, qty, price) {
  const tableBody = invoiceTable.querySelector("tbody");
  const rows = tableBody.querySelectorAll("tr");
  let productFound = false;

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const existingName = cells[0].textContent;

    if (existingName === name) {
      const existingQty = parseInt(cells[1].textContent);
      const updatedQty = existingQty + parseInt(qty);
      cells[1].textContent = updatedQty;
      cells[2].textContent = `$${(updatedQty * price).toFixed(2)}`;
      productFound = true;
    }
  });

  if (!productFound) {
    const totalPrice = (qty * price).toFixed(2);

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${qty}</td>
      <td>$${totalPrice}</td>
    `;
    tableBody.appendChild(newRow);

    // Add the product to the invoiceItems array
    invoiceItems.push({ name, qty, price: totalPrice });
  }

  updateTotalPrice(clearBtn);
}

function updateTotalPrice() {
  const tableBody = invoiceTable.querySelector("tbody");
  const rows = tableBody.querySelectorAll("tr");
  let total = 0;

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td"); // i merr krejt table data qka jon
    const rowTotal = parseFloat(cells[2].textContent.replace("$", "")); // e parson ne float, edhe e merr poziten e 2 te array, qe osht price
    total += rowTotal; // edhe ia shton totalit
  });

  totalSpan.textContent = total.toFixed(2); // toFixed(2) i merr veq dy vlerat e fundit mas presjes dhjetore
  updateClearBtnState(clearBtn);
  updateClearBtnState(invoiceBtn);
}

foodsBtn.addEventListener("click", () => {
  selectP.innerHTML = "";
  getProducts("https://66f70a80b5d85f31a341de97.mockapi.io/food");
});

drinksBtn.addEventListener("click", () => {
  selectP.innerHTML = "";
  getProducts("https://66fadba98583ac93b40a3134.mockapi.io/drinks");
});

dessertsBtn.addEventListener("click", () => {
  selectP.innerHTML = "";
  getProducts("https://66fadba98583ac93b40a3134.mockapi.io/desserts");
});

chargeBtn.addEventListener("click", () => {
  const amountValue = parseFloat(amountInp.value) || 0;
  const totalValue = parseFloat(totalSpan.textContent.replace("$", "")) || 0;

  const chargeValue = amountValue - totalValue;

  checkCharge.textContent = `${chargeValue.toFixed(2)}`;
});

payBtn.addEventListener("click", () => {
  const amountValue = parseFloat(amountInp.value) || 0;
  const totalValue = parseFloat(totalSpan.textContent.replace("$", "")) || 0;
  const chargeValue = parseFloat(checkCharge.textContent.replace("$", "")) || 0;

  if (totalValue === 0) {
    payMsg.textContent = "You didnt buy anything!";
    payMsg.style.color = "red";

    setInterval(() => {
      payMsg.textContent = "";
      payMsg.style.color = "";
    }, 4000);
  } else if (amountValue >= totalValue) {
    if (parseFloat(chargeValue) === 0.0) {
      payMsg.innerHTML = `THANK YOU!`;
      payMsg.style.color = "#add8e6";
    } else if (totalValue > 0) {
      payMsg.innerHTML = `THANK YOU! Please take the charge back: <span style='font-size: 20px;'>$${chargeValue.toFixed(
        2
      )}`;
      payMsg.style.color = "  #add8e6";

      setInterval(() => {
        payMsg.textContent = "";
        payMsg.style.color = "";
      }, 4000);
    } else if (totalSpan === 0) {
      payMsg.innerHTML = `THANK YOU!`;
      payMsg.style.color = "green";
    }
    setTotalToApi(totalValue);
  } else {
    const amountNeeded = (totalValue - amountValue).toFixed(2);
    payMsg.innerHTML = ` You need  <span style='font-size: 20px;'>$${amountNeeded} </span>more.`;
    payMsg.style.color = "red";
  }
});

clearBtn.addEventListener("click", () => {
  const totalValue = parseFloat(totalSpan.innerHTML);

  if (totalValue > 0) {
    const confirmation = confirm(
      "Are you sure that you want to clear the receipt?"
    );

    if (confirmation) {
      const tableBody = invoiceTable.querySelector("tbody");
      tableBody.innerHTML = "";

      const qtyInputs = document.querySelectorAll(".qty");
      qtyInputs.forEach((input) => (input.value = ""));

      totalSpan.innerHTML = "0.00";
      checkCharge.innerHTML = "0.00";
      amountInp.value = "";
      payMsg.innerHTML = "";
      modal.innerHTML = "";
      invoiceItems.length = 0;

      updateClearBtnState(clearBtn);
      updateClearBtnState(invoiceBtn);
    }
  }
});

let totalProductsBought = 0;

invoiceBtn.addEventListener("click", function () {
  modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 class="invoiceh2">Invoice</h2>
            <hr>
            <table class="tabel">
                <thead class="koka">
                    <tr class="table-row">
                        <th class="table-head">Product Name</th>
                        <th class="table-head">Quantity</th>
                        <th class="table-head">Price ($)</th>
                    </tr>
                </thead>
                <tbody class="table-body">
                    ${invoiceItems
                      .map(
                        (item) => `
                        <tr class="table-row">
                            <td class="table-data">${item.name}</td>
                            <td class="table-data">${item.qty}</td>
                            <td class="table-data">${item.price}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
            <hr>
            <p class="total total-sum">Total: $ <span>${
              totalSpan.textContent
            }</span></p>
            <p class="amount amountl">Amount: $<span>${
              !amountInp.value ? "0.00" : parseFloat(amountInp.value).toFixed(2)
            }</span></p>
            <p class="charge charge-sum">Change: <span>${
              checkCharge.textContent
            }</span></p>
                        <p class="product-count">Total Products Bought: <span>${invoiceItems.reduce(
                          (count, item) => count + parseInt(item.qty),
                          0
                        )}</span></p>

            
        </div>
    `;

  modal.style.display = "block";

  const closeButton = modal.querySelector(".close");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});

signOut.addEventListener("click", function () {
  const confirmation = confirm("Are you sure you want to sign out?");
  if (confirmation) {
    document.body.innerHTML = `
    <div class="loader-container">
        <span class="loader"></span>
        <p class='text'>Signing out</p>
    </div>`;

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2500);
  }
});

menu.addEventListener("click", () => openFile("menu"));
customer.addEventListener("click", () => openFile("customer"));
inventory.addEventListener("click", () => openFile("inventory"));

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

const createTable = (place) => {
  const tableHTML = `
    <table class='table'>
      <thead class='thead'>
        <tr class='tr'>
          <th class='th'>Product name</th>
          <th class='th'>Quantity</th>
          <th class='th'>Price ($)</th>
        </tr>
      </thead>
      <tbody class='tbody'>

      </tbody>
    </table>
  `;
  place.innerHTML = tableHTML;
};

const updateClearBtnState = (button) => {
  const totalValue = parseFloat(totalSpan.innerHTML);

  if (totalValue === 0) {
    button.disabled = true;
    button.style.cursor = "not-allowed";
  } else if (totalValue > 0) {
    button.disabled = false;
    button.style.cursor = "pointer";
  }
};

createTable(invoiceTable);
updateClearBtnState(clearBtn);
updateClearBtnState(invoiceBtn);

const hamburgerBtn = document.getElementById("hamburger-btn");
const nav = document.querySelector(".nav");
const hamburgerNav = document.querySelector(".hamburger");
const navSection = document.querySelector(".nav-section");

hamburgerBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !hamburgerBtn.contains(event.target)) {
    nav.classList.remove("active"); // Hide navbar
    navSection.classList.add("nav-section");
  }
});

async function setTotalToApi(total) {
  const url = "https://67076dd6a0e04071d22a3edc.mockapi.io/payments";

  const currentDate = new Date().toISOString().split("T")[0];
  const paymentData = {
    date: currentDate,
    total: total,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Error fetching data!");
    }
    alert(`Invoice saved successfully`);
  } catch (err) {
    throw new Error("Error adding total to API");
  }
}

// ("https://67076dd6a0e04071d22a3edc.mockapi.io/payments");
