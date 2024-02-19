"use strict";

const { getCollection, toObjectId } = require("./dbModule.js");

const entity = "carts";

async function addOrder(userID, username, products) {
  const collection = await getCollection(entity);
  await collection.insertOne({
    userID,
    username,
    products,
  });
}
async function getAllOrders() {
  const collection = await getCollection(entity);
  const allOrders = await collection.find().toArray();
  return allOrders;
}
// example for cart object = { userID, username [{productName, amount}] }

async function addToCart() {}
async function removeFromCart() {}
async function getUserCart() {}
async function getAllCartsByAdmin() {}

module.exports = { addOrder, getAllOrders };
