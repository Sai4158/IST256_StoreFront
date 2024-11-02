// Array for products
let products = [];

// AngularJS app
const app = angular.module("storeApp", []);

app.controller("ProductController", function ($http) {
  const vm = this;
  vm.products = [];
  vm.cart = [];
  vm.newProduct = {};
  vm.shipping = {};
  vm.shippingDetails = null;

  // Fetch shipping details from the server
  vm.getShippingDetails = function () {
    $http
      .get("http://localhost:3000/api/shipping")
      .then((response) => {
        vm.shippingDetails = response.data;
      })
      .catch((error) =>
        console.error("Error fetching shipping details:", error)
      );
  };

  // Submit shipping details to the server
  vm.submitShipping = function () {
    $http
      .post("http://localhost:3000/api/shipping", vm.shipping)
      .then((response) => {
        alert("Shipping details submitted successfully!");

        // Clear form fields after submission
        vm.shipping = {};

        // Refresh shipping data
        vm.getShippingDetails();
      })
      .catch((error) =>
        console.error("Error submitting shipping details:", error)
      );
  };

  // Fetch products from the server
  vm.getProducts = function () {
    $http
      .get("http://localhost:3000/api/products")
      .then((response) => {
        vm.products = response.data;
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  // Fetch cart items from the server
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
    vm.saveCart();
  };

  // Search for products by name
  vm.searchProduct = function () {
    $http
      .get("http://localhost:3000/api/products/search", {
        params: { name: vm.searchTerm },
      })
      .then((response) => {
        vm.products = response.data;
        vm.searchTerm = "";
      })
      .catch((error) => console.error("Error searching products:", error));
  };

  // Add new product to the server
  vm.addProduct = function () {
    $http
      .post("http://localhost:3000/api/products", vm.newProduct)
      .then((response) => {
        vm.products.push(response.data); // Add to products list
        vm.newProduct = {}; // Clear form fields
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
          // Remove product from the local array for real time UI update
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
  vm.getShippingDetails();
});
