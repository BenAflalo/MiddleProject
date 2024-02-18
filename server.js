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
      await userModule.addUser(email, username, password);
    }
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
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
    return res.send({ success: true, allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { id } = req.body;
    const productArr = await productsModule.getProductById(id);
    const product = productArr.pop();
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
    return res.send({ success: true, allFilteredProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.post("/buy", async (req, res) => {
  try {
    const { user, products } = req.body;
    const userID = user._id;
    const username = user.username;
    await cartsModule.addOrder(userID, username, products);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});
app.get("/buy", async (req, res) => {
  try {
    // const message = `<body onload="initBuy()"><h1>SV-shop</h1></body>`
    // return res.send({ success: true, message })
    // return res
    //   .status(200)
    //   .send(`<main onload="initBuy()"><div class="container"></div></main>`);
    return res.status(200).send(`
      <h1>SV-shop</h1>
      <p>Total product: </p>
      <p>Total price: $</p>
      <button onclick="saveorder()">Approve</button>
      `);
  } catch (error) {
    console.log(error);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
