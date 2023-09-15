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
    .catch((err) => console.log(err));
});

tagSection.addEventListener("click", function (event) {
  let tag = event.target.closest(".tag-card");
  updateActiveTags(tag, activeTags);
  let filteredArray = filterByTag(activeTags, activeRecipes);
  createRecipeCards(filteredArray);
});

searchButton.addEventListener("click", function (event) {
  let searchTerm = searchInput.value;
  let searchedRecipes = searchRecipes(searchTerm, activeRecipes);
  createRecipeCards(searchedRecipes);
  if (searchedRecipes.length === 0) {
    buildSearchFail();
  }
});

recipeArea.addEventListener("click", function (event) {
  let recipeClicked = event.target.parentElement.id;
  let foundRecipe = locateRecipe(recipeClicked, data.recipes);
  let recipeIngredients = getIngredientNames(foundRecipe, data.ingredients);
  let cost = calculateCost(foundRecipe, data.ingredients);
  buildRecipeCard(foundRecipe, data.ingredients, recipeIngredients, cost);
  displayRecipeTag(recipeClicked, currentUser, data.recipes);
  displayRecipeCard();
});

recipeCardBookmarkAdd.addEventListener("click", function (event) {
  let bookmarkClicked = event.target.id;
  addRecipe(currentUser.id, bookmarkClicked).then((responseData) => {
    data.users = responseData;
    let users = data.users.users;
    currentUser = updateUser(users, currentUser);
    // updateUser updates the currentUser with the data from the database not the local DM!!!
    displayRecipeTag(bookmarkClicked, currentUser, data.recipes);
  });
});

recipeCardBookmarkDelete.addEventListener("click", function (event) {
  let bookmarkClicked = event.target.id;
  deleteRecipe(bookmarkClicked, currentUser);
  displayRecipeTag(bookmarkClicked, currentUser, data.recipes);
  activeRecipes = updateActiveRecipes(currentUser, data);
  // the DOM will be updated on the close of the recipe card
});

recipeCardClose.addEventListener("click", function (event) {
  displayRecipeArea();
  createRecipeCards(activeRecipes);
});

userSavedRecipes.addEventListener("click", function (event) {
  activeRecipes = updateActiveRecipes(currentUser, data);
  createRecipeCards(activeRecipes);
});

discoverRecipes.addEventListener("click", function (event) {
  activeRecipes = [...data.recipes];
  createRecipeCards(activeRecipes);
});

const loadUser = (users) => {
  let randomUserIndex = Math.floor(Math.random() * users.length);
  currentUser = users[randomUserIndex];
  currentUser.recipesToCook = [];
};
