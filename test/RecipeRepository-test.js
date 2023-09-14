import { expect } from "chai";

const { recipeTestData } = require("../src/data/testData");

const {
  filterByTag,
  searchRecipes,
} = require("../src/recipes");

describe("RecipeRepository", () => {
let recipe0, recipe1, recipe2, recipe3, recipe4;

  beforeEach(()=> {
    recipe0 = recipeTestData[0]
    recipe1 = recipeTestData[1]
    recipe2 = recipeTestData[2]
    recipe3 = recipeTestData[3]
    recipe4 = recipeTestData[4]
  })

  describe("Filter recipes by Tag", () => {
    
    it("Should filter recipes when given one tag", () => {
      const taggedRecipes = filterByTag(["side dish"], recipeTestData);
      expect(taggedRecipes).to.deep.equal([recipe2, recipe3]);
    });
    
    it("Should filter recipes when given multiple tags", () => {
      const taggedRecipes = filterByTag(["snack", "lunch"], recipeTestData);
      expect(taggedRecipes).to.deep.equal([
        recipe0,
        recipe1,
        recipe4,
      ]);
    });

    it("Should not add duplicates when a snack is in more than one category", () => {
      const taggedRecipes = filterByTag(
        ["hor d'oeuvre", "snack"],
        recipeTestData
      );
      expect(taggedRecipes).to.deep.equal([recipe0, recipe4]);
    });
    
    it("Should return the recipe with searched ingredient", () => {
      const taggedRecipes = filterByTag(["snack"], recipeTestData);
      expect(taggedRecipes).to.deep.equal([recipe0, recipe4]);
    });
    
    //sad paths
    it("Should return an empty array when no recipes match the tag", () => {
      const taggedRecipes = filterByTag(["nonexistent"], recipeTestData);
      expect(taggedRecipes).to.deep.equal([]);
    });

    it("Should not return any recipes if no ingredient match is found", () => {
      const taggedRecipes = filterByTag(["nonexistent"], recipeTestData);
      expect(taggedRecipes).to.deep.equal([]);
    });
  });

  describe("Search Recipes", () => {
    it("Should search recipes when given any part of a recipes name e.g. Chocolate is in 'Chocolate Chip Cookies' and 'Chocolate Cake'", () => {
      const searchedRecipe = searchRecipes("chocolate", recipeTestData);
      expect(searchedRecipe).to.deep.equal([
        recipe0,
        recipe3,
      ]);
    });
    
    it("Should handle case insensitivity", () => {
      const searchedRecipe = searchRecipes("CHOCOLATE", recipeTestData);
      expect(searchedRecipe).to.deep.equal([
        recipe0,
        recipe3,
      ]);
    });

    it("Should return undefined if no recipe is found", () => {
      const searchedRecipe = searchRecipes("nonexistent", recipeTestData);
      expect(searchedRecipe).to.deep.equal([]);
    });
    
    it("Should do nothing if the search term is an empty string", () => {
      const searchedRecipe = searchRecipes("", recipeTestData);
      expect(searchedRecipe).to.deep.equal(recipeTestData);
    });
    
    it("Should return an empty array when no recipes match the search term", () => {
      const searchedRecipe = searchRecipes("nonexistent", recipeTestData);
      expect(searchedRecipe).to.deep.equal([]);
    });
  });
});

