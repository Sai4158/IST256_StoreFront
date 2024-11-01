// items in the json format
let products = [
  {
    id: "1",
    name: "Grapes",
    description: "Fresh grapes",
    category: "Fruits",
    unit: "kg",
    price: 3.0,
    weight: "1kg",
    image:
      "//fruitstand.art/cdn/shop/products/Figs-SheerCornflower-Hero_b27a9527-d835-4959-a2e5-ba564130793c_3000x.jpg?v=1675662198",
  },
  {
    id: "2",
    name: "Banana",
    description: "Ripe bananas",
    category: "Fruits",
    unit: "dozen",
    price: 3.78,
    weight: "1 dozen",
    image:
      "//fruitstand.art/cdn/shop/files/Banana-02-Hero_3000x.jpg?v=1696180358",
  },
  {
    id: "3",
    name: "Raspberry",
    description: "Fresh raspberries",
    category: "Fruits",
    unit: "box",
    price: 4.99,
    weight: "500g",
    image:
      "//fruitstand.art/cdn/shop/products/Raspberry011_3000x.jpg?v=1675662195",
  },
  {
    id: "4",
    name: "Strawberry",
    description: "Sweet strawberries",
    category: "Fruits",
    unit: "box",
    price: 7.0,
    weight: "500g",
    image:
      "//fruitstand.art/cdn/shop/products/Strawberry-01-Hero_3000x.jpg?v=1675662211",
  },
];

// Show current items
products.forEach((product) => {
  addProductToGrid(product);
});

// Empty cart
let cart = [];

// Add product to the grid
function addProductToGrid(product) {
  const gridItem = `
    <div class="grid-item">
      <img src="${product.image}" alt="${product.name}" class="item-image" />
      <h3 class="item-title">${product.name}</h3>
      <p class="item-price">$${product.price}</p>
      <p class="item-description">${product.description}</p>
      <p class="item-category">Category: ${product.category}</p>
      <p class="item-unit">Unit: ${product.unit}</p>
      <p class="item-weight">Weight: ${product.weight}</p>
      <button class="btn btn-success addToCart" data-id="${product.id}">Add to Cart</button>
      <button class="btn btn-danger deleteProduct" data-id="${product.id}">Delete</button>
    </div>
  `;
  $("#productGrid").append(gridItem);
}

// Add to Cart functionality
$(document).on("click", ".addToCart", function () {
  const productId = $(this).data("id").toString();
  const product = products.find((p) => p.id === productId);

  if (product) {
    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateCart();
  } else {
    alert("Product not found.");
  }
});

// Update Cart display
function updateCart() {
  let cartHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name} x ${item.quantity} - $${itemTotal.toFixed(2)}
        <button class="btn btn-danger btn-sm removeItem" data-id="${
          item.id
        }">Remove</button>
      </li>
    `;
  });

  // Display cart items
  if (cartHTML === "") {
    cartHTML = "<p>Your cart is empty.</p>";
  }
  $("#cartItems").html(cartHTML);

  // Update total price
  $("#cartTotal").text(`Total: $${total.toFixed(2)}`);
}

// Remove item from Cart
$(document).on("click", ".removeItem", function () {
  const productId = $(this).data("id").toString();

  // Remove the item from the cart based on the id
  cart = cart.filter((item) => item.id !== productId);

  updateCart();
});

// Form submission for adding new products
$("#productForm").on("submit", function (event) {
  event.preventDefault();

  const productId = $("#itemId").val() ? $("#itemId").val().trim() : "";
  const itemName = $("#itemName").val() ? $("#itemName").val().trim() : "";
  const itemDescription = $("#itemDescription").val()
    ? $("#itemDescription").val().trim()
    : "";
  const itemCategory = $("#itemCategory").val()
    ? $("#itemCategory").val().trim()
    : "";
  const itemUnit = $("#itemUnit").val() ? $("#itemUnit").val().trim() : "";
  const itemPrice = $("#itemPrice").val() ? $("#itemPrice").val().trim() : "";
  const itemWeight = $("#itemWeight").val()
    ? $("#itemWeight").val().trim()
    : "";
  const itemImage = $("#itemImage").val() ? $("#itemImage").val().trim() : "";

  // Check required fields
  if (
    productId &&
    itemName &&
    itemDescription &&
    itemCategory &&
    itemUnit &&
    itemPrice &&
    itemImage
  ) {
    const product = {
      id: productId,
      name: itemName,
      description: itemDescription,
      category: itemCategory,
      unit: itemUnit,
      price: itemPrice,
      weight: itemWeight || "N/A",
      image: itemImage,
    };

    products.push(product);
    addProductToGrid(product);
    displayProductDetails(product);

    $("#productForm")[0].reset();
  } else {
    alert("Added to DB");
  }
});

// Display added product details as JSON
function displayProductDetails(product) {
  const productDetails = `
    <pre>${JSON.stringify(product, null, 2)}</pre>
  `;
  $("#productDetails").append(productDetails);
}

$("#searchForm").on("submit", function (event) {
  event.preventDefault();

  const searchValue = $("#searchName").val().trim().toLowerCase();

  if (searchValue) {
    const found = searchProduct(searchValue);
    if (found) {
      alert("Product not found.");
    }
  }
});

// Function to search for a product by name
function searchProduct(searchValue) {
  if (!searchValue) {
    // If the search term is empty, show all products and return
    $(".grid-item").show();
    return;
  }

  let found = false;

  $(".grid-item").each(function () {
    const productName = $(this).find(".item-title").text().toLowerCase();
    if (productName.indexOf(searchValue.toLowerCase()) > -1) {
      $(this).show();
      found = true;
    } else {
      $(this).hide();
    }
  });

  // If no products were found, show all products and alert it
  if (!found) {
    $(".grid-item").show();
    alert("NOT FOUND!");
  }
}

// Handle "Go back" button to reset the search and show all products
$("#goBack").on("click", function (e) {
  e.preventDefault();
  $(".grid-item").show();
  $("#searchName").val("");
});

// Field integrity check example for the shipping form
$("#shippingForm").on("submit", function (event) {
  event.preventDefault();

  const destination = $("#destination").val();
  const carrier = $("#carrier").val();
  const method = $("#method").val();

  if (!destination || !carrier || !method) {
    alert("All fields are required.");
    return;
  }

  sendShippingDetails({ destination, carrier, method });
});

//  Displaying Shipping Details as JSON -  not in use need restful API service
function displayShippingDetails(details) {
  const shippingDetails = `
    <pre>${JSON.stringify(details, null, 2)}</pre>
  `;
  $("#productDetails").append(shippingDetails);
}

// script.js
const app = angular.module("storeApp", []);

app.controller("ProductController", function ($http) {
  const vm = this;
  vm.products = [];
  vm.cart = [];
  vm.newProduct = {};

  // Fetch products from the server
  vm.getProducts = function () {
    $http
      .get("http://localhost:3000/api/products")
      .then((response) => {
        vm.products = response.data;
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  // Fetch cart from the server
  vm.getCart = function () {
    $http
      .get("http://localhost:3000/api/cart")
      .then((response) => {
        vm.cart = response.data.items || [];
      })
      .catch((error) => console.error("Error fetching cart:", error));
  };

  // Add product to cart
  vm.addToCart = function (product) {
    const existingItem = vm.cart.find((item) => item.productId === product._id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      vm.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
    vm.saveCart();
  };

  // Save or update cart in MongoDB
  vm.saveCart = function () {
    $http
      .post("http://localhost:3000/api/cart", { items: vm.cart })
      .then(() => alert("Cart saved!"))
      .catch((error) => console.error("Error saving cart:", error));
  };

  // Calculate total price of items in cart
  vm.getCartTotal = function () {
    return vm.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Remove item from cart
  vm.removeFromCart = function (item) {
    // Filter out the item by its productId
    vm.cart = vm.cart.filter(
      (cartItem) => cartItem.productId !== item.productId
    );

    // Update the cart in the backend
    vm.saveCart(); // Save the modified cart to the server
  };

  // Search for products by name
  vm.searchProduct = function () {
    $http
      .get("http://localhost:3000/api/products/search", {
        params: { name: vm.searchTerm },
      })
      .then((response) => {
        vm.products = response.data;
      })
      .catch((error) => console.error("Error searching products:", error));
  };

  vm.addProduct = function () {
    $http
      .post("http://localhost:3000/api/products", vm.newProduct)
      .then((response) => {
        vm.products.push(response.data); // Add the new product to the products list
        vm.newProduct = {}; // Clear the form fields
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  // Delete a product by ID
  vm.deleteProduct = function (productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      $http
        .delete(`http://localhost:3000/api/products/${productId}`)
        .then(() => {
          alert("Product deleted successfully!");
          // Remove product from the local array for real-time UI update
          vm.products = vm.products.filter(
            (product) => product._id !== productId
          );
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  // Initialize by loading products and cart
  vm.getProducts();
  vm.getCart();
});

// Event listener for delete button
$(document).on("click", ".deleteProduct", function () {
  const productId = $(this).data("id").toString();

  if (confirm("Are you sure you want to delete this product?")) {
    $.ajax({
      url: `http://localhost:3000/api/products/${productId}`,
      type: "DELETE",
      success: function (response) {
        alert("Product deleted successfully!");
        // Remove the product from the grid
        $(`.grid-item:has(button[data-id='${productId}'])`).remove();
      },
      error: function (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product.");
      },
    });
  }
});
