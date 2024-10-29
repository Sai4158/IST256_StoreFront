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

  const productId = $("#itemId").val().trim();
  const itemName = $("#itemName").val().trim();
  const itemDescription = $("#itemDescription").val().trim();
  const itemCategory = $("#itemCategory").val().trim();
  const itemUnit = $("#itemUnit").val().trim();
  const itemPrice = $("#itemPrice").val();
  const itemWeight = $("#itemWeight").val();
  const itemImage = $("#itemImage").val();

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
    alert("Please fill out all required fields before submitting.");
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
