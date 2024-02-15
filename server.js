require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const validator = require("validator");
const userModule = require("./modules/userModule.js");
const productsModule = require("./modules/productsModule.js");

app.use(express.static("client"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "login.html"));
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("email not valid");
    } else {
      // console.log(validator.isEmail(email))
      await userModule.addUser(email, username, password);
    }
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  // change in to email and not username
  try {
    const { email, password } = req.body;
    const user = await userModule.getUserByUsername(email);
    return res.send({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.post("/api/newProduct", async (req, res) => {
  try {
    const { productName, productPrice } = req.body;
    const newPrice = parseFloat(productPrice);
    await productsModule.addProduct(productName, newPrice);
    const allProducts = await productsModule.getProducts();
    return res.send({ success: true, allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.get("/api/home", async (req, res) => {
  try {
    const allProducts = await productsModule.getProducts();
    // console.log(allProducts)
    return res.send({ success: true, allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productsModule.getProductById(id);
    return res.send({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});
app.get("/api/filterByPrice", async (req, res) => {
  try {
    const allFilteredProducts = await productsModule.getProductsByPrice();
    return res.send({ success: true, allFilteredProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});
app.get("/api/filterByName", async (req, res) => {
  try {
    const allFilteredProducts = await productsModule.getProductsByName();
    // console.log(allFilteredProducts)
    return res.send({ success: true, allFilteredProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.get("/buy", async (req, res) => {});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
