//NOTE: Data model and non-dom manipulating logic will live in this file.
import "./styles.css";
import "./print-styles.css";
import "./images/bookmark-regular.svg";
import "./images/bookmark-solid.svg";
import "./images/x-solid.svg";
import promises, { addRecipe, fetchUsers } from "./apiCalls";

import {
  createRecipeCards,
  locateRecipe,
  buildRecipeCard,
  displayRecipeCard,
  displayRecipeArea,
  deleteRecipe,
  displayRecipeTag,
  buildSearchFail,
  updateActiveTags,
  updateUser,
  updateActiveRecipes,
  displayErrorMessage,
} from "./domUpdates.js";

import {
  filterByTag,
  searchRecipes,
  getIngredientNames,
  calculateCost,
} from "../src/recipes.js";
const activeTags = [];
let currentUser;
let activeRecipes;
let data;
// ^ This will be used to help double check and see if a recipe has already been made or not

// ===== QUERY SELECTORS =====
const tagSection = document.querySelector(".tag-area");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const recipeArea = document.querySelector(".recipe-area");
const recipeCardClose = document.querySelector(".close");
const recipeCardBookmarkAdd = document.querySelector(".icon-bookmark");
const recipeCardBookmarkDelete = document.querySelector(".solid-bookmark");
const userSavedRecipes = document.querySelector("#myRecipes");
const discoverRecipes = document.querySelector("#discoverRecipes");
const errorMessage = document.querySelector("#error");

// ===== EVENT LISTENERS =====

window.addEventListener("load", function () {
  Promise.all(promises)
    .then((res) => {
      data = {
        users: res["0"].users,
        ingredients: res["1"].ingredients,
        recipes: res["2"].recipes,
      };

      loadUser(res["0"].users);
      createRecipeCards(res["2"].recipes);
      activeRecipes = [...res["2"].recipes];
    })
    // sorry the network seems busy, please try again later, be sure to make sure your server is running
    .catch(() => {
      let userGetErrorMessage =
        "Sorry the network seems to not be working - make sure the server is running and reload the page";
      displayErrorMessage(userGetErrorMessage);
      tagSection.classList.toggle("hidden", true);
    });
});


tagSection.addEventListener("click", function (event) {
});

function handleTagClick(event) {
  let tag = event.target.closest(".tag-card");
  updateActiveTags(tag, activeTags);
  let filteredArray = filterByTag(activeTags, activeRecipes);
  createRecipeCards(filteredArray);
}

searchButton.addEventListener("click", function (event) {
  let searchTerm = searchInput.value;
  let searchedRecipes = searchRecipes(searchTerm, activeRecipes);
  createRecipeCards(searchedRecipes);
  if (searchedRecipes.length === 0) {
    buildSearchFail();
  }
});

recipeArea.addEventListener("click", function (event) {
  handleClickedRecipe(event);
});

recipeArea.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    handleClickedRecipe(event);
  }
});

function handleClickedRecipe(event) {
  let recipeClicked = event.target.parentElement.id;
  let foundRecipe = locateRecipe(recipeClicked, data.recipes);
  let recipeIngredients = getIngredientNames(foundRecipe, data.ingredients);
  let cost = calculateCost(foundRecipe, data.ingredients);
  buildRecipeCard(foundRecipe, data.ingredients, recipeIngredients, cost);
  displayRecipeTag(recipeClicked, currentUser, data.recipes);
  displayRecipeCard();
}

recipeCardBookmarkAdd.addEventListener("click", function (event) {
  handleAddRecipe(event);
});

recipeCardBookmarkAdd.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    handleAddRecipe(event);
  }
});

function handleAddRecipe(event) {
  let bookmarkClicked = event.target.id;
  addRecipe(currentUser.id, bookmarkClicked)
    .then((responseData) => {
      data.users = responseData;
      let users = data.users.users;
      currentUser = updateUser(users, currentUser);
      // updateUser updates the currentUser with the data from the database not the local DM!!!
      displayRecipeTag(bookmarkClicked, currentUser, data.recipes);
    })
    .catch(() => {
      let userPostErrorMessage =
        "There was a problem saving that recipe, please try a different one";
      displayErrorMessage(userPostErrorMessage);
      tagSection.classList.toggle("hidden", true);
      setTimeout(() => {
        errorMessage.classList.toggle("hidden", true);
        tagSection.classList.toggle("hidden", true);
        displayRecipeArea();
        createRecipeCards(activeRecipes);
      }, 1500);
    });
}

// recipeCardBookmarkDelete.addEventListener("click", function (event) {
//   let bookmarkClicked = event.target.id;
//   deleteRecipe(bookmarkClicked, currentUser);
//   displayRecipeTag(bookmarkClicked, currentUser, data.recipes);
//   activeRecipes = updateActiveRecipes(currentUser, data);
//   // the DOM will be updated on the close of the recipe card
// });

recipeCardClose.addEventListener("click", function (event) {
  handleCardClose(event);
});

recipeCardClose.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    handleCardClose(event);
  }
});

function handleCardClose(event) {
  displayRecipeArea();
  createRecipeCards(activeRecipes);
}

userSavedRecipes.addEventListener("click", function (event) {
  handleSavedRecipes(event);
});

userSavedRecipes.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    handleSavedRecipes(event);
  }
});

function handleSavedRecipes(event) {
  activeRecipes = updateActiveRecipes(currentUser, data);
  createRecipeCards(activeRecipes);
}

discoverRecipes.addEventListener("click", function (event) {
  handleDiscoverRecipes(event);
});

discoverRecipes.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    handleDiscoverRecipes(event);
  }
});

function handleDiscoverRecipes(event) {
  console.log(data);
  activeRecipes = [...data.recipes];
  createRecipeCards(activeRecipes);
}

const loadUser = (users) => {
  let randomUserIndex = Math.floor(Math.random() * users.length);
  currentUser = users[randomUserIndex];
  currentUser.recipesToCook = [];
};
