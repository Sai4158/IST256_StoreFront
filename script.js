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
  vm.searchPerformed = false;
  vm.returnDetails = {};
  vm.returnRequests = [];
  vm.newShopper = {};
  vm.shoppers = [];

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
        vm.searchPerformed = false;
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
    return vm.cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
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
        vm.searchPerformed = true;
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

  vm.submitReturn = function () {
    $http
      .post(`${baseURL}/api/returns`, vm.returnDetails)
      .then(() => {
        alert(
          "Return request submitted successfully. Your return is now processing."
        );
        vm.returnDetails = {};
        vm.getLatestReturnDetails();
      })
      .catch((error) => {
        console.error("Error submitting return request:", error);
        alert(
          "There was an error submitting your return request. Please try again later."
        );
      });
  };

  // Fetch the latest return details
  vm.getLatestReturnDetails = function () {
    $http
      .get(`${baseURL}/api/returns`)
      .then((response) => {
        vm.latestReturnDetails = response.data[0] || null;
      })
      .catch((error) => {
        console.error("Error fetching return details:", error);
      });
  };

  // Add Shopper
  vm.addShopper = async function () {
    try {
      const response = await $http.post("/api/shoppers", vm.newShopper);
      vm.shoppers.push(response.data);
      vm.newShopper = {}; // Clear form fields
      alert("Shopper added successfully!");
    } catch (error) {
      console.error("Error adding shopper:", error);
      alert("Failed to add shopper.");
    }
  };

  // Fetch Shoppers
  vm.fetchShoppers = async function () {
    try {
      const response = await $http.get("/api/shoppers");
      vm.shoppers = response.data;
    } catch (error) {
      console.error("Error fetching shoppers:", error);
      alert("Failed to fetch shoppers.");
    }
  };

  // Edit Shopper (Pre-fill form for update)
  vm.editShopper = function (shopper) {
    vm.newShopper = angular.copy(shopper);
  };

  // Delete Shopper
  vm.deleteShopper = async function (id) {
    try {
      await $http.delete(`/api/shoppers/${id}`);
      vm.shoppers = vm.shoppers.filter((shopper) => shopper._id !== id);
      alert("Shopper deleted successfully!");
    } catch (error) {
      console.error("Error deleting shopper:", error);
      alert("Failed to delete shopper.");
    }
  };

  // Initialize by loading products and cart
  vm.getProducts();
  vm.getCart();
  vm.getShippingDetails();
  vm.getLatestReturnDetails();
  vm.fetchShoppers();
});
