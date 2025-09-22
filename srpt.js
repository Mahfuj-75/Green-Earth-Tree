function clearActiveButtons() 
{
  const buttons = document.querySelectorAll(".btn-cat");
  buttons.forEach(btn => btn.classList.remove("active"));
}
function toggleSpinner(show) 
{
  const spinner = document.getElementById("spinner");
  const plantContainer = document.getElementById("plants-container");

  if (show) 
    {
    spinner.classList.remove("hidden");
    plantContainer.classList.add("hidden");
  } 
  else 
    {
    spinner.classList.add("hidden");
    plantContainer.classList.remove("hidden");
  }
}


const allBtn = document.getElementById("btn-all-plant");
allBtn.classList.add("active");
allBtn.addEventListener("click", () => 
{
  clearActiveButtons();
  allBtn.classList.add("active");
  loadAllPlants();
});
function loadCategories() 
{
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => showCategories(data.categories));
}


function loadAllPlants() 
{
  toggleSpinner(true);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => showPlants(data.plants));
}


function loadCategoryPlants(id) 
{
  toggleSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then(res => res.json())
    .then(data => showPlants(data.plants));
}
function showPlants(plants) 
{
  const container = document.getElementById("plants-container");
  container.innerHTML = "";
  container.classList.add("grid", "grid-cols-1", "md:grid-cols-3", "gap-4");

  plants.forEach(plant => 
{
    const card = document.createElement("div");
    card.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col");

    card.innerHTML = `
      <img src="${plant.image}" class="h-48 w-full object-cover rounded-lg mb-4 plant-img">

      <h2 id="${plant.id}" class="text-lg font-bold mb-2 plant-name">${plant.name}</h2>
      <p class="text-sm text-gray-600 mb-4">${plant.description}</p>

      <div class="flex items-center justify-between mt-auto">
        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">${plant.category}</span>
        <p class="text-xl font-semibold text-gray-800">৳ ${plant.price}</p>
      </div>

      <button class="w-full mt-4 bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800 btn-cart">
        Add to Cart
      </button>
    `;

    container.appendChild(card);
  });

  toggleSpinner(false);
}

function showCategories(categories) 
{
  const catContainer = document.getElementById("cat-container");
  catContainer.innerHTML = "";

  categories.forEach(category => 
    {
    const btn = document.createElement("button");
    btn.id = `cat-btn-${category.category_name}`;
    btn.className = "py-1 btn-cat";
    btn.innerText = category.category_name;

    btn.onclick = () => 
        {
      clearActiveButtons();
      btn.classList.add("active");
      loadCategoryPlants(category.id);
    };

    catContainer.appendChild(btn);
  });
}

async function loadPlantDetail(id) 
{
  const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
  const data = await res.json();
  showPlantDetails(data.plants);
}

function showPlantDetails(plant) 
{
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
    <div>
      <h1 class="font-bold text-lg mb-2">${plant.name}</h1>
      <img src="${plant.image}" class="h-48 w-full object-cover rounded-lg mb-2">
      <p class="mb-2"><span class="font-bold">Category: </span>${plant.category}</p>
      <p class="mb-2"><span class="font-bold">Price: </span>৳ ${plant.price}</p>
      <p><span class="font-bold">Description:</span> ${plant.description}</p>
    </div>
  `;
  document.getElementById("plant_modal").showModal();
}

document.getElementById("plants-container").addEventListener("click", e => 
    {
  if (e.target.classList.contains("plant-name")) 
{
    loadPlantDetail(e.target.id);
  }
});

let cart = [];

document.getElementById("plants-container").addEventListener("click", e => 
    {
  if (e.target.classList.contains("btn-cart")) 
    {
    const plantCard = e.target.closest("div");
    const name = plantCard.querySelector("h2").innerText;
    const price = parseFloat(plantCard.querySelector("p.text-xl").innerText.replace("৳","").trim());

    let item = cart.find(p => p.name === name);
    if (item) 
    {
      item.quantity++;
    } 
    else 
 {
      cart.push({ name, price, quantity: 1 });
    }
    updateCart();
  }
});

function updateCart() 
{
  const cartContainer = document.getElementById("cart-items-container");
  cartContainer.innerHTML = "";

  cart.forEach(item => 
    {
    const cartItem = document.createElement("div");
    cartItem.classList.add("flex", "justify-between", "bg-[#f0fdf4]", "p-2", "rounded-lg", "mb-2");

    cartItem.innerHTML = `
      <div>
        <h1 class="font-medium text-sm md:text-base">${item.name}</h1>
        <p class="text-sm md:text-base">৳${item.price} x <span>${item.quantity}</span></p>
      </div>
      <button class="remove-btn text-red-500 text-xl" data-name="${item.name}">×</button>
    `;

    cartItem.querySelector(".remove-btn").addEventListener("click", () => 
    {
      decreaseItem(item.name);
    });

    cartContainer.appendChild(cartItem);
  });

  updateTotal();
}

function decreaseItem(name) 
{
  cart = cart.map(item =>
    item.name === name ? 
    { ...item, quantity: item.quantity - 1 } : item
  ).filter(item => item.quantity > 0);

  updateCart();
}
function updateTotal() 
{
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("total-price").children[0].innerText = total.toFixed(2);
}
loadCategories();
loadAllPlants();
