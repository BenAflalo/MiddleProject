"use strict"

async function login(event) {
    try {
        event.preventDefault()
        const form = event.target
        const formData = getFormData(form)
        const { password, email } = formData

        if (email === "" || password === "") return
        const user = {email, password}
        const data = await makeFetchRequest("/api/login", "POST",user)

        const loggedInUser = data.user
        storageService.setUser(loggedInUser)
        window.location.href = "/home.html"
    } catch (error) {
        console.log(error)
        alert(error.message)
    }
}

async function signup(event) {
    try {
        event.preventDefault()
        const form = event.target
        const formData = getFormData(form)
        const { username, password, email } = formData

        if (username === "" || password === "" || email === "") {
            alert("Something went wrong!😓")
            return
        }

        const credentials = {
            username,
            password,
            email,
        }
        const data = await makeFetchRequest("/api/register", "POST",credentials)
       
        window.location.href = "login.html"
    } catch (error) {
        console.log(error)
    }
}

function logout() {
    storageService.clearAll()
    window.location.href = "login.html"
}

async function addProduct(event) {
    try {
        event.preventDefault()
        const form = event.target
        const formData = getFormData(form)
        const { productName, productPrice } = formData

        if (productName === "" || productPrice === "") {
            alert("Something went wrong!😓")
            return
        }

        const product = {
            productPrice,
            productName
        }
        const data = await makeFetchRequest("/api/newProduct", "POST",product)

        const products = data.allProducts 
        renderProducts(products)

    } catch (error) {
        console.log(error)
    } finally{
        document.getElementById("productName").value = ""
        document.getElementById("productPrice").value = ""
    }
}

async function init() {
    try {
        const user = storageService.getUser()
        if (!user) { // can remove later if we have time to add botton "to login" from home
            window.location.href = "login.html"
            return
        }

        const data = await makeFetchRequest("/api/home") 

        const products = data.allProducts 
        renderProducts(products)
    } catch (error) {
        console.log(error)
    }
    
}

function renderProducts(products){
    const strHTMLSs = products.map((product) => {
        // let className = todo.isDone ? "done" : "" //maybe play with it later for css
    
        return `<div onclick="addToCart('${product._id}')" class="product-item">
                    <p class="name">${product.productName}</p>
                    <p class="price">${product.price}$</p>
                </div>`
      })
      document.querySelector(".products-list").innerHTML = strHTMLSs.join("")
}

function getFormData(form) {
    return Array.from(form.elements).reduce((acc, input) => {
      if (input.name) acc[input.name] = input.value
      return acc
    }, {})
  }

  async function makeFetchRequest(url, method = "GET", body = null) {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    })
  
    const data = await response.json()
  
    if (!data.success) {
      alert(data.message)
      return
    }
  
    return data
  }

  async function addToCart(id) {
    const data = await makeFetchRequest("/api/cart", "POST",{id})
    storageService.addProductToCart(data.product)
  }

  async function chooseFilter() {
    try {
        const filter = document.getElementById("select").value
        if(filter === "price"){
            filterByPrice()
        }else{
            filterByName()
        }
        
    } catch (error) {
        console.log(error)
    }

  }

 async function filterByPrice() {
    try {
        const data = await makeFetchRequest("/api/filterByPrice")
        const products = data.allFilteredProducts 
        renderProducts(products)
    } catch (error) {
        console.log(error)
    }
}

async function filterByName(){
    try {
        const data = await makeFetchRequest("/api/filterByName")
        const products = data.allFilteredProducts 
        renderProducts(products)
    } catch (error) {
        console.log(error)
        
    }
  }

  async function redirectToBuy() { //not finished
    try {
        const products = storageService.getProducts()
        const totalProducts = products.length
        const totalPrice = products.reduce((a,b)=> a+b.price,0)
        const message = generateMessage(totalProducts,totalPrice)
        storageService.saveMessage(message)
        const data = await makeFetchRequest("/buy")
    
        window.location.href = "/buy"
        
    } catch (error) {
        
    }finally{
        
    }
    
  }

  function generateMessage(totalProducts, totalPrice){
    return `
    <h1>SV-shop</h1>
    <p>Total product: ${totalProducts}</p>
    <p>Total price: ${totalPrice}$</p>
    <button onclick="saveorder()">Approve</button>
    `
}
async function initBuy() {
    return storageService.getMessage()
}
  
async function cart() {
    const user = storageService.getUser()

    if (!user) {
        window.location.href = "login.html"
        return
    }

    //! refrence to shop cart on load

    // const todos = storageService.getTodos()
    // if (todos.length > 0) {
    //   renderTodos(todos)
    // } else {
    //   const response = await fetch(`/api/todo?userId=${user._id}`)
    //   const data = await response.json()
    //   if (!data.success) return alert(data.message)

    //   const loadedTodos = data.todos
    //   if (loadedTodos || loadedTodos.length > 0) {
    //     storageService.setTodos(loadedTodos)
    //     renderTodos(loadedTodos)
    //   }
    // }
}


// ! refrence to render shop cart
// function renderTodos(todos) {
//     //   console.log("todos in renderTodos: ", todos)
    // const strHTMLSs = todos.map((todo) => {
    //   let className = todo.isDone ? "done" : ""
  
    //   return `
    //       <div class="todo-item">
    //           <p onclick="toggleTodo('${todo._id}')" class="${className}">${todo.txt}</p>
    //           <button onclick="removeTodo('${todo._id}')">Delete</button>
    //       </div>
    //   `
    // })
  
//     document.querySelector(".todo-list").innerHTML = strHTMLSs.join("")
//   }