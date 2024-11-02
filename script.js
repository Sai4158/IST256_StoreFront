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

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://storefront256.vercel.app";

  vm.products = [];
  vm.cart = [];
  vm.newProduct = {};
  vm.shipping = {};
  vm.shippingDetails = null;

  // Update each $http request to use the `baseURL`
  vm.getShippingDetails = function () {
    $http
      .get(`${baseURL}/api/shipping`)
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
      .post(`${baseURL}/api/shipping`, vm.shipping)
      .then((response) => {
        alert("Shipping details submitted successfully!");
        vm.shipping = {};
        vm.getShippingDetails();
      })
      .catch((error) =>
        console.error("Error submitting shipping details:", error)
      );
  };

  // Fetch products from the server
  vm.getProducts = function () {
    $http
      .get(`${baseURL}/api/products`)
      .then((response) => {
        vm.products = response.data;
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  // Fetch cart items from the server
  vm.getCart = function () {
    $http
      .get(`${baseURL}/api/cart`)
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
      .post(`${baseURL}/api/cart`, { items: vm.cart })
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
    vm.cart = vm.cart.filter(
      (cartItem) => cartItem.productId !== item.productId
    );
    vm.saveCart();
  };

  // Search for products by name
  vm.searchProduct = function () {
    $http
      .get(`${baseURL}/api/products/search`, {
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
      .post(`${baseURL}/api/products`, vm.newProduct)
      .then((response) => {
        vm.products.push(response.data);
        vm.newProduct = {};
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  // Delete a product by ID
  vm.deleteProduct = function (productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      $http
        .delete(`${baseURL}/api/products/${productId}`)
        .then(() => {
          alert("Product deleted successfully!");
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
