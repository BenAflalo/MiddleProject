"use strict"

const USER_KEY = "loggedInUser"
const CART_KEY = "cartItems"
const MSS_KEY = "sumCart"

const storageService = {
    getUser() {
        const user = JSON.parse(localStorage.getItem(USER_KEY))
        return user || null
    },
    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    clearAll() {
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(CART_KEY)
    },
    getProducts() {
        const products = JSON.parse(localStorage.getItem(CART_KEY))
        return products || []
    },
    setProducts(products) {
        localStorage.setItem(CART_KEY, JSON.stringify(products))
    },
    addProductToCart(product) {
        const products = this.getProducts()
        products.push(product)
        this.setProducts(products)
    },
    saveMessage(message){
        localStorage.setItem(MSS_KEY,JSON.stringify(message))
    },
    getMessage(){
        const message = JSON.parse(localStorage.getItem(MSS_KEY))
        return message
    }
}
