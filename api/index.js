// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Set up CORS configuration
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "https://storefront256.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Set up body parser
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ist256:ist256@cluster0.z6qre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  unit: String,
  price: String,
  weight: String,
  image: String,
  quantity: { type: String, default: "1" },
});
const Product = mongoose.model("Product", productSchema);

// Define cart schema and model
const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      name: String,
      price: String,
      quantity: { type: String, default: "1" },
    },
  ],
});
const Cart = mongoose.model("Cart", cartSchema);

// Define shipping schema and model
const shippingSchema = new mongoose.Schema({
  destination: String,
  carrier: String,
  method: String,
  billingAddress: String,
  paymentMethod: String,
});
const Shipping = mongoose.model("Shipping", shippingSchema);

// return schema and model
const returnSchema = new mongoose.Schema({
  orderId: String,
  productId: String,
  reason: String,
  comments: String,
});
const Return = mongoose.model("Return", returnSchema);

// Route to handle product returns
app.post("/api/returns", async (req, res) => {
  try {
    const returnRequest = new Return(req.body);
    await returnRequest.save();
    res.status(201).json(returnRequest);
  } catch (error) {
    console.error("Error submitting return request:", error);
    res.status(500).json({ error: "Error submitting return request" });
  }
});
// Route to retrieve return requests
app.get("/api/returns", async (req, res) => {
  try {
    // Sort by latest
    const returnRequests = await Return.find().sort({ _id: -1 });
    res.status(200).json(returnRequests);
  } catch (error) {
    console.error("Error fetching return requests:", error);
    res.status(500).json({ error: "Error fetching return requests" });
  }
});

// Route to add a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Error saving product" });
  }
});

// Route to search products by name
app.get("/api/products/search", async (req, res) => {
  try {
    const searchTerm = req.query.name || "";
    const regex = new RegExp(searchTerm, "i");
    const products = await Product.find({ name: regex });
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Error searching products" });
  }
});

// Route to get the latest shipping details
app.get("/api/shipping", async (req, res) => {
  try {
    const shippingDetails = await Shipping.findOne().sort({ _id: -1 });
    res.status(200).json(shippingDetails || {});
  } catch (error) {
    console.error("Error fetching shipping details:", error);
    res.status(500).json({ error: "Error fetching shipping details" });
  }
});

// Route to get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Route to save or update the cart
app.post("/api/cart", async (req, res) => {
  try {
    let cart = await Cart.findOne();
    cart
      ? (cart.items = req.body.items)
      : (cart = new Cart({ items: req.body.items }));
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error saving cart:", error);
    res.status(500).json({ error: "Error saving cart" });
  }
});

// Route to retrieve cart items
app.get("/api/cart", async (req, res) => {
  try {
    const cart = await Cart.findOne();
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// Route to submit shipping details
app.post("/api/shipping", async (req, res) => {
  try {
    const shipping = new Shipping(req.body);
    await shipping.save();
    res.status(201).json(shipping);
  } catch (error) {
    console.error("Error saving shipping details:", error);
    res.status(500).json({ error: "Error saving shipping details" });
  }
});

// Route to delete a product by ID
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting product." });
  }
});

// Start the server only if running locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app for serverless deployment
module.exports = app;
