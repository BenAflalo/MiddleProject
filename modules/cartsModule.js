"use strict";

const { getCollection, toObjectId } = require("./dbModule.js");

const entity = "carts";

async function addOrder(userID, username, products) {
  const collection = await getCollection(entity);
  const filteredProducts = products.map((product) => {
    // let itemInCart = products.find((item) => product._id === productID);
    if (product._id) {
      amount++;
    }
  });
  //   let itemInCart = cart.find(item => item.id === itemId);

  //   if (itemInCart) {
  //     itemInCart.amount++;
  //   } else {
  //     cart.push({ id: itemId, amount: 1 });
  //   }
  await collection.insertOne({
    userID,
    username,
    products: [
      {
        product: products.productname,
        price: products.price,
        amount: products.amount,
      },
    ],
  });
}
// example for cart object = { userID, products [{productName, price , amount}] }

async function addToCart() {}
async function removeFromCart() {}
async function getUserCart() {}
async function getAllCartsByAdmin() {}
