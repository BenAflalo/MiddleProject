"use strict"

const { getCollection, toObjectId } = require("./dbModule.js")

const entity = "users"


async function addUser(email, username, password) {
    try {
        const collection = await getCollection(entity)
        const existUser = await collection.findOne({ email })

        if (existUser) {
            throw new Error("email already exist😢")
        }

        await collection.insertOne({ username, password, email })
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function getUserByUsername(email) {
    try {
        const collection = await getCollection(entity)
        const user = await collection.findOne({ email })
        if (!user) throw new Error("User not found😢")
        const { password, ...restUserDetails } = user
        return restUserDetails
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = { addUser, getUserByUsername }