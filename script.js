
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

// Form submission
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
    </div>
  `;
  $("#productGrid").append(gridItem);
}

// Display as JSON
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
    if (!found) {
      alert("Product not found.");
    }
  } else {
    alert("Please enter a product name to search.");
  }
});

// Function to search for a product by name
function searchProduct(searchValue) {
  let found = false;

  $(".grid-item").each(function () {
    const productName = $(this).find(".item-title").text().toLowerCase();
    if (productName.includes(searchValue)) {
      found = true;
    }
  });

  if (found) {
    alert("Product found.");
  } else {
    alert("Not found, please add it.");
  }

  return found;
}
