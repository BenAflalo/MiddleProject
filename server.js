require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const validator = require("validator");
const userModule = require("./modules/userModule.js");
const productsModule = require("./modules/productsModule.js");
const cartsModule = require("./modules/cartsModule.js");

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
app.get("/api/filterBySearchBar", async (req, res) => {
  try {
    const allFilteredProducts = await productsModule.getProducts();
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
    const { user, filteredProducts } = req.body;
    const userID = user._id;
    const username = user.username;
    await cartsModule.addOrder(userID, username, filteredProducts);
    return res.send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.get("/all", async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true";
    if (isAdmin) {
      return res.redirect("all.html").send({ success: true });
      // res.send(`Welcome to the all page.`);
    } else {
      return res.status(400).send("Access denied.");
    }
  } catch (error) {
    console.log(error);
  }
});
app.post("/all", async (req, res) => {
  try {
    const allOrders = await cartsModule.getAllOrders();
    // console.log(allOrders);
    //   const strOrders = allOrders.map((objProduct) => {
    //     let str = ` <tr>
    //     <td>${objProduct.username}</td>
    //     <td>${objProduct.products}</td>
    // </tr>`;
    //     return str;
    //   });
    return res.send({ success: true, allOrders });
  } catch (error) {
    console.log(error);
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
