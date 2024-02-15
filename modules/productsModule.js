"use strict"

const { ObjectId } = require("mongodb")
const { getCollection, toObjectId } = require("./dbModule.js")

const entity = "products"

async function addProduct(productName, price) {
    const collection = await getCollection(entity)
    const existProduct = await collection.findOne({ productName })

    if (existProduct) {
        throw new Error("product already exist😢")
    }

    await collection.insertOne({ productName, price })
}

async function getProducts() {
    const collection = await getCollection(entity)
    const products = await collection.find().toArray()
    return products

}
async function getProductById(id) {
    const collection = await getCollection(entity)
    const mongoID = toObjectId(id)
    const product = await collection.find(mongoID).toArray()
    // console.log(product)
    return product

}

async function getProductsByPrice() {
    const collection = await getCollection(entity)
    const sortedCollection = await collection.find().sort({ price: -1 }).toArray()
    return sortedCollection
}
async function getProductsByName() {
    const collection = await getCollection(entity)
    const sortedCollection = await collection.find().sort({ productName: 1 }).toArray()
    return sortedCollection
}

async function removeProduct() { } //maybe add at the end
async function updateProduct() { } //maybe add at the end

module.exports = { addProduct, getProducts, getProductById, getProductsByName, getProductsByPrice }