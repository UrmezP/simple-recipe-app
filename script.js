var randomMeal;

// handler for getting random recipe on page load
async function getRandomRecipe() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await res.json();
  return data.meals[0];
}

// handler for searching recipe
async function getSearchRecipe() {
  const searchInput = document.querySelector("#search input");
  const searchTerm = searchInput.value;
  if (searchTerm.trim() == "") {
    alert("Enter input first, then use search");
    return;
  }

  // clear out the input field
  searchInput.value = "";

  // fetch data from MealDB asynchronously
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
  );

  // get json response
  const data = await res.json();

  // open up Dialog element, with the current meal data
  openRecipe(data.meals[0]);
}

// handler to removve favourite recipes from list
// favourite recipes are stored locally in the ------ localStorage
function removeFromCart(recipe) {
  const favRecipes = JSON.parse(localStorage.getItem("simple-recipes"));
  const updatedfavRecipes = favRecipes.filter((rec) => {
    if (rec.strMeal == recipe.strMeal) {
      return false;
    }
    return true;
  });
  localStorage.setItem("simple-recipes", JSON.stringify(updatedfavRecipes));
  closeRecipe();
  checkLocalStorage();
}

// close the dialog element
function closeRecipe() {
  const dialog = document.querySelector("dialog");

  // update add and remove buttons, only when closing the currrent dialog
  const addDialogElement = dialog.querySelector("button#add");
  const removeDialogElement = dialog.querySelector("button#remove");

  // remove event listners from previous func call
  removeDialogElement.replaceWith(removeDialogElement.cloneNode(true));
  addDialogElement.replaceWith(addDialogElement.cloneNode(true));

  // finally, close
  dialog.close();
}

// update favourite recipes box
function checkLocalStorage() {
  const favRecipes = JSON.parse(localStorage.getItem("simple-recipes"));
  const section = document.querySelector("section");
  const favourites = section.querySelector("article#favourites");
  favourites.remove();

  const newFavourites = document.createElement("article");
  newFavourites.id = "favourites";
  newFavourites.style.flexWrap = "wrap";
  section.prepend(newFavourites);

  if (favRecipes == null || favRecipes.length == 0) {
    section.classList.add("empty");
  } else {
    section.classList.remove("empty");
    const favHeading = document.createElement("h2");
    favHeading.innerText = "Favourites";
    favHeading.style.width = "100%";
    newFavourites.appendChild(favHeading);
    favRecipes.map((recipe) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      const h2 = document.createElement("h2");
      img.src = recipe.strMealThumb;
      h2.innerText = recipe.strMeal;
      div.append(img);
      div.append(h2);
      //run openModal with recipe object on click
      div.addEventListener("click", () => openRecipe(recipe));
      newFavourites.appendChild(div);
    });
  }
}

// add recipe to favourites in localStorage
function addToCart(recipe) {
  let hasRecipes = JSON.parse(localStorage.getItem("simple-recipes"));
  if (!hasRecipes) {
    hasRecipes = [];
    hasRecipes.push(recipe);
  } else {
    hasRecipes.push(recipe);
  }
  localStorage.setItem("simple-recipes", JSON.stringify(hasRecipes));
  closeRecipe();
  checkLocalStorage();
}

function openRecipe(recipe) {
  // get all references for openRecipe dialog state
  const dialog = document.querySelector("dialog");
  const dialogImg = dialog.querySelector("img");
  const dialogTitle = dialog.querySelector("h2");
  const dialogInstructions = dialog.querySelector("p");
  const closeDialogElement = dialog.querySelector("button#close");
  const addDialogElement = dialog.querySelector("button#add");
  const removeDialogElement = dialog.querySelector("button#remove");

  // add close click listener on dialog
  closeDialogElement.addEventListener("click", closeRecipe);

  addDialogElement.addEventListener("click", () => {
    console.log("here");
    addToCart(recipe);
  });

  // get list of recipes, if already in localstorage, show remove button and hide add button
  let recipeExists;
  const favRecipes = JSON.parse(localStorage.getItem("simple-recipes"));
  if (favRecipes) {
    recipeExists = favRecipes.find((rec) => {
      if (rec.strMeal == recipe.strMeal) {
        return true;
      }
    });
  }
  // hide add
  if (recipeExists) {
    removeDialogElement.classList.remove("hidden");
    addDialogElement.classList.add("hidden");
  } else {
    // show add
    removeDialogElement.classList.add("hidden");
    addDialogElement.classList.remove("hidden");
  }

  removeDialogElement.addEventListener("click", () => removeFromCart(recipe));

  dialogImg.src = recipe.strMealThumb;
  dialogTitle.innerText = recipe.strMeal;
  dialogInstructions.innerText = recipe.strInstructions;

  dialog.showModal();
}

window.addEventListener("load", async () => {
  const randomArticle = document.querySelector("section article#random");

  // fetch random recipe and show on screen
  randomMeal = await getRandomRecipe();

  checkLocalStorage();

  const randomMealDiv = document.createElement("div");
  const randomMealImg = document.createElement("img");
  const randomMealName = document.createElement("h2");

  randomMealImg.src = randomMeal.strMealThumb;
  randomMealName.innerText = randomMeal.strMeal;

  randomMealDiv.appendChild(randomMealImg);
  randomMealDiv.appendChild(randomMealName);
  randomArticle.appendChild(randomMealDiv);

  // click fn on random recipe
  randomMealDiv.addEventListener("click", () => openRecipe(randomMeal));

  // search for recipe
  const searchButton = document.querySelector("#search button");
  searchButton.addEventListener("click", getSearchRecipe);
});
