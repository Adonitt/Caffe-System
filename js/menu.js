const dashboard = document.getElementById("dashboard");
const customer = document.getElementById("customer");
const inventory = document.getElementById("inventory");
const userLogin = document.getElementById("user-login");
const signOut = document.getElementById("sign-out");
const productsTable = document.getElementById("table-products");
const foodsBtn = document.getElementById("foods");
const drinksBtn = document.getElementById("drinks");
const dessertsBtn = document.getElementById("desserts");
const productName = document.getElementById("product-name").value;
const productQty = document.getElementById("product-qty").value;
const productPrice = document.getElementById("product-price").value;
const productCategory = document.getElementById("product-category").value;
const imageUrl = document.getElementById("image-url").value;
const apiBtn = document.getElementById("api");
const selectP = document.getElementById("selectP");

const loggedInUser = localStorage.getItem("loggedInUser");
userLogin.innerHTML = `${loggedInUser}`;

dashboard.addEventListener("click", () => openFile("dashboard"));
customer.addEventListener("click", () => openFile("customer"));
inventory.addEventListener("click", () => openFile("inventory"));

async function getProducts(apiUrl) {
  try {
    const responseApiFile = await fetch(apiUrl);
    if (!responseApiFile.ok) {
      throw new Error("Error fetching data");
    }

    const apiData = await responseApiFile.json();

    if (apiData.length === 0) {
      // nese eshte 0
      productsTable.innerHTML = `<p class='selectP'>No products added</p>`;
      return; // kthehu mos vazhdo tutje
    }

    productsTable.innerHTML = `
<table>
  <thead>
    <tr>
      <th>Id</th>
      <th>Product Name</th>
      <th>Price ($)</th>
      <th>Quantity</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="products-tbody">
  </tbody>
</table>
`;
    const productsTbody = document.getElementById("products-tbody");

    // Render the product rows from each category API
    apiData.forEach((product, index) => {
      const row = `
    <tr id="product-${product.id}">
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.quantity}</td>
      <td class="btn-table"><button class="delete-btn" style="background-color: #d84343;"
       data-id="${product.id}" data-category="${
        product.category
      }">Delete</button></td>
    </tr>
  `;
      productsTbody.innerHTML += row;
    });

    // Event delegation to handle delete button clicks
    productsTbody.addEventListener("click", (event) => {
      // Check if a delete button was clicked
      if (event.target && event.target.classList.contains("delete-btn")) {
        // console.log(event.target.dataset);
        const productId = event.target.getAttribute("data-id"); 
        const category = event.target.getAttribute("data-category"); 
        const rowElement = event.target.closest("tr"); 

        deleteProductFromApi(productId, category, rowElement); 
      }
    });
  } catch (err) {
    console.log(err);
  }
}

foodsBtn.addEventListener("click", () => {
  getProducts("https://66f70a80b5d85f31a341de97.mockapi.io/food");
});
drinksBtn.addEventListener("click", () => {
  getProducts("https://66fadba98583ac93b40a3134.mockapi.io/drinks");
});

dessertsBtn.addEventListener("click", () => {
  getProducts("https://66fadba98583ac93b40a3134.mockapi.io/desserts");
});

const apiUrls = {
  foods: "https://66f70a80b5d85f31a341de97.mockapi.io/food",
  drinks: "https://66fadba98583ac93b40a3134.mockapi.io/drinks",
  desserts: "https://66fadba98583ac93b40a3134.mockapi.io/desserts",
};

async function deleteProductFromApi(productId, category, rowElement) {
  const url = `${apiUrls[category]}/${productId}`;
  // url thote mere ne array categorine, edhe ne product id shtoje cilin element po don me fshi

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the product");
    }

    rowElement.remove();
    alert(`Product deleted successfully from ${category}`);
  } catch (err) {
    console.error("Error:", err);
  }
}

const openFile = (file) => {
  document.body.innerHTML = `
<div class="loader-container">
  <span class="loader"></span>
  <p class='text'>Opening ${file.charAt(0).toUpperCase() + file.slice(1)}</p>
</div>`;

  setTimeout(() => {
    window.location.href = `${file}.html`;  // <-- ndryshimi kyç këtu
  }, 400);
};

signOut.addEventListener("click", function () {
  const confirmation = confirm("Are you sure you want to sign out?");
  if (confirmation) {
    document.body.innerHTML = `
<div class="loader-container">
    <span class="loader"></span>
    <p class='text'>Signing out</p>
</div>`;

    setTimeout(() => {
      window.location.href = "customer.html";
    }, 2500);
  }
});

const addBtn = document.getElementById("add-btn");

async function addToApi() {
  const productName = document.getElementById("product-name").value;
  const productQty = document.getElementById("product-qty").value;
  const productPrice = document.getElementById("product-price").value;
  const productCategory = document.getElementById("product-category").value;
  const imageUrl = document.getElementById("image-url").value;

  const productData = {
    name: productName,
    qty: productQty,
    price: productPrice,
    category: productCategory,
    img: imageUrl,
  };

  if (productCategory === "foods") {
    url = "https://66f70a80b5d85f31a341de97.mockapi.io/food";
  } else if (productCategory === "drinks") {
    url = "https://66fadba98583ac93b40a3134.mockapi.io/drinks";
  } else if (productCategory === "desserts") {
    url = "https://66fadba98583ac93b40a3134.mockapi.io/desserts";
  } else {
    alert("Invalid category selected");
    return;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to Add Product");
    }

    const result = await response.json();
    alert("Product added successfully");
    console.log("Product added successfully: ", result);
    document.getElementById("product-name").value = "";
    document.getElementById("product-qty").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-category").value = "";
    document.getElementById("image-url").value = "";
  } catch (err) {
    console.log("Error", err);
  }
}

addBtn.addEventListener("click", () => {
  const productName = document.getElementById("product-name").value;
  const productQty = document.getElementById("product-qty").value;
  const productPrice = document.getElementById("product-price").value;
  const productCategory = document.getElementById("product-category").value;
  const imageUrl = document.getElementById("image-url").value;

  if (
    !productName ||
    !productQty ||
    !productPrice ||
    !productCategory ||
    !imageUrl
  ) {
    alert("All fields must be filled out.");
    return;
  }

  // Correctly call the function
  addToApi();
});

// https://66f70a80b5d85f31a341de97.mockapi.io/customer
// https://66f70a80b5d85f31a341de97.mockapi.io/food
// https://66fadba98583ac93b40a3134.mockapi.io/drinks
// https://66fadba98583ac93b40a3134.mockapi.io/desserts
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
