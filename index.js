// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Set up CORS to allow requests from specific origins
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow specific local addresses
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ist256:ist256@cluster0.z6qre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define Product schema and model
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

// Define Cart schema and model
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

// API Routes

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    console.log("Received product data:", req.body);
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Error saving product" });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Search for products by name
app.get("/api/products/search", async (req, res) => {
  try {
    const searchTerm = req.query.name || "";
    const regex = new RegExp(searchTerm, "i"); // Case-insensitive search
    const products = await Product.find({ name: regex });
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Error searching products" });
  }
});

// Save or update the cart
app.post("/api/cart", async (req, res) => {
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: req.body.items });
    } else {
      cart.items = req.body.items; // Update the cart items
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error saving cart:", error);
    res.status(500).json({ error: "Error saving cart" });
  }
});

// Retrieve the cart items
app.get("/api/cart", async (req, res) => {
  try {
    const cart = await Cart.findOne();
    res.status(200).json(cart ? cart : { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.delete("/api/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Assuming you are using MongoDB and Mongoose
    await Product.findByIdAndDelete(productId);
    res.status(200).send({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting product." });
  }
});
