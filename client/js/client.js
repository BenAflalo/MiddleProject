"use strict";

async function login(event) {
  try {
    event.preventDefault();
    const form = event.target;
    const formData = getFormData(form);
    const { password, email } = formData;

    if (email === "" || password === "") return;
    const user = { email, password };
    const data = await makeFetchRequest("/api/login", "POST", user);

    const loggedInUser = data.user;
    storageService.setUser(loggedInUser);
    window.location.href = "/home.html";
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
}

async function signup(event) {
  try {
    event.preventDefault();
    const form = event.target;
    const formData = getFormData(form);
    const { username, password, email } = formData;

    if (username === "" || password === "" || email === "") {
      alert("Something went wrong!😓");
      return;
    }

    const credentials = {
      username,
      password,
      email,
    };
    const data = await makeFetchRequest("/api/register", "POST", credentials);

    window.location.href = "login.html";
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  storageService.clearAll();
  window.location.href = "login.html";
}

async function addProduct(event) {
  try {
    event.preventDefault();
    const form = event.target;
    const formData = getFormData(form);
    const { productName, productPrice } = formData;

    if (productName === "" || productPrice === "") {
      alert("Something went wrong!😓");
      return;
    }

    const product = {
      productPrice,
      productName,
    };
    const data = await makeFetchRequest("/api/newProduct", "POST", product);

    const products = data.allProducts;
    renderProducts(products);
  } catch (error) {
    console.log(error);
  } finally {
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
  }
}

async function init() {
  try {
    const user = storageService.getUser();
    if (!user) {
      // can remove later if we have time to add botton "to login" from home
      window.location.href = "login.html";
      return;
    }

    const data = await makeFetchRequest("/api/home");

    const products = data.allProducts;
    renderProducts(products);
  } catch (error) {
    console.log(error);
  }
}

function renderProducts(products) {
  const strHTMLSs = products.map((product) => {
    // let className = todo.isDone ? "done" : "" //maybe play with it later for css

    return `<div onclick="addToCart('${product._id}')" class="product-item">
                    <p class="name">${product.productName}</p>
                    <p class="price">${product.price}$</p>
                </div>`;
  });
  document.querySelector(".products-list").innerHTML = strHTMLSs.join("");
}

function getFormData(form) {
  return Array.from(form.elements).reduce((acc, input) => {
    if (input.name) acc[input.name] = input.value;
    return acc;
  }, {});
}

async function makeFetchRequest(url, method = "GET", body = null) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  return data;
}

async function addToCart(id) {
  const data = await makeFetchRequest("/api/cart", "POST", { id });
  const products = data.product;
  products.amount = 1;
  console.log(products);
  storageService.addProductToCart(products);
}

async function chooseFilter() {
  try {
    const filter = document.getElementById("select").value;
    if (filter === "price") {
      filterByPrice();
    } else {
      filterByName();
    }
  } catch (error) {
    console.log(error);
  }
}

async function filterByPrice() {
  try {
    const data = await makeFetchRequest("/api/filterByPrice");
    const products = data.allFilteredProducts;
    renderProducts(products);
  } catch (error) {
    console.log(error);
  }
}

async function filterByName() {
  try {
    const data = await makeFetchRequest("/api/filterByName");
    const products = data.allFilteredProducts;
    renderProducts(products);
  } catch (error) {
    console.log(error);
  }
}

// async function redirectToBuy() {
// try {
//   const products = storageService.getProducts();

//   const productHash = { Banana: 0, gum: 0 };
//   for (let i = 0; i < products.length; i++) {
//     if (productHash[products[i].name]) {
//       productHash[products[i].name]++;
//     }
//   }
async function redirectToBuy() {
  try {
    const products = storageService.getProducts();
    const productHash = {
      Bread: 0,
      Milk: 0,
      Banana: 0,
      Apple: 0,
      Juice: 0,
      Carrot: 0,
      Corn: 0,
      Pizza: 0,
      PizzaXL: 0,
      gum: 0,
      Egg: 0,
      Tuna: 0,
      Butter: 0,
    };
    const filteredProducts = [];
    for (let i = 0; i < products.length; i++) {
      if (productHash.hasOwnProperty(products[i].productName)) {
        productHash[products[i].productName]++;
      }
    }
    for (const [product, quantity] of Object.entries(productHash)) {
      if (quantity > 0) {
        // console.log(`${product}: ${quantity}`);
        const filteredProduct = { product: `${product} : ${quantity}` };
        filteredProducts.push(filteredProduct);
      }
    }
    console.log(filteredProducts);
    window.location.href = "buy.html";
  } catch (error) {
    console.error("Error:", error);
  }
}

async function initBuy() {
  const products = storageService.getProducts();
  const totalProducts = products.length;
  const totalPrice = products.reduce((a, b) => a + b.price, 0);
  const strHTMLSs = `
  <p>Total product: ${totalProducts}</p>
  <p>Total price: ${totalPrice}$</p>
  `;
  document.querySelector(".total-items").innerHTML = strHTMLSs;
}
async function saveorder() {
  try {
    const products = storageService.getProducts();
    const productHash = {
      Bread: 0,
      Milk: 0,
      Banana: 0,
      Apple: 0,
      Juice: 0,
      Carrot: 0,
      Corn: 0,
      Pizza: 0,
      PizzaXL: 0,
      gum: 0,
      Egg: 0,
      Tuna: 0,
      Butter: 0,
    };
    const filteredProducts = [];
    for (let i = 0; i < products.length; i++) {
      if (productHash.hasOwnProperty(products[i].productName)) {
        productHash[products[i].productName]++;
      }
    }
    for (const [product, quantity] of Object.entries(productHash)) {
      if (quantity > 0) {
        // console.log(`${product}: ${quantity}`);
        const filteredProduct = { product: `${product} : ${quantity}` };
        filteredProducts.push(filteredProduct);
      }
    }

    const user = storageService.getUser();
    const cartInfo = { filteredProducts, user };
    const data = await makeFetchRequest("/buy", "POST", cartInfo);
    // window.location.href = "login.html"
    alert(`Your order has been completed`);
  } catch (error) {
    console.log(error);
  }
}

async function cart() {
  const user = storageService.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
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
