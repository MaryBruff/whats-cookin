import { expect } from "chai";

const { recipeTestData, ingredientsTestData } = require("../src/data/testData");

const {
  calculateCost,
  getIngredientNames,
} = require("../src/recipes");

describe("Get Ingredients", () => {
  //happy path
  it("Should determine the list of ingredients for a recipe", () => {
    const ingredientList = getIngredientNames(
      recipeTestData[0],
      ingredientsTestData
    );
    expect(ingredientList).to.deep.equal([
      "wheat flour",
      "bicarbonate of soda",
      "eggs",
      "sucrose",
      "instant vanilla pudding",
      "brown sugar",
      "salt",
      "fine sea salt",
      "semi sweet chips",
      "unsalted butter",
      "vanilla",
    ]);
  });
  
  it("Should handle recipe with multiple identical ingredients", () => {
    const recipe = {
      ingredients: [
        { id: 1, name: "Flour" },
        { id: 1, name: "Flour" },
        { id: 2, name: "Sugar" },
      ],
    };
    const ingredients = [
      { id: 1, name: "Flour" },
      { id: 2, name: "Sugar" },
    ];
    const ingredientNames = getIngredientNames(recipe, ingredients);
    expect(ingredientNames).to.deep.equal(["Flour", "Sugar"]);
  });
  
  //sad paths
  it("Should return an empty array when recipe has no ingredients", () => {
    const recipe = {
      ingredients: [],
    };
    const ingredients = [
      { id: 1, name: "Flour" },
      { id: 2, name: "Sugar" },
    ];
    const ingredientNames = getIngredientNames(recipe, ingredients);
    expect(ingredientNames).to.deep.equal([]);
  });
  
  it("Should handle recipe ingredients not present in the provided ingredients list", () => {
    const recipe = {
      ingredients: [
        { id: 10, name: "Unknown Ingredient" },
        { id: 20, name: "Another Unknown Ingredient" },
      ],
    };
    const ingredients = [
      { id: 1, name: "Flour" },
      { id: 2, name: "Sugar" },
    ];
    const ingredientNames = getIngredientNames(recipe, ingredients);
    expect(ingredientNames).to.deep.equal([]);
  });
});

describe("calculateCost", () => {
  //happy paths
  it("should calculate the cost of a recipe with one ingredient", () => {
    const recipe = {
      id: 1,
      ingredients: [{ id: 1, quantity: { amount: 1 } }],
    };
    const ingredients = [{ id: 1, estimatedCostInCents: 100 }];
    const totalCost = calculateCost(recipe, ingredients);
    expect(totalCost).to.equal(1);
  });
  
  it("should calculate the cost of a different recipe's ingredients", () => {
    const recipe = {
      id: 4,
      ingredients: [
        { id: 4, quantity: { amount: 2 } },
        { id: 5, quantity: { amount: 3 } },
      ],
    };
    const ingredients = [
      { id: 4, estimatedCostInCents: 150 },
      { id: 5, estimatedCostInCents: 200 },
    ];
    const totalCost = calculateCost(recipe, ingredients);
    const expectedTotalCost = (2 * 150 + 3 * 200) / 100;
    expect(totalCost).to.equal(expectedTotalCost);
  });
  
  it("should calculate the cost of a simple recipe", () => {
    const recipe = {
      id: 6,
      ingredients: [
        { id: 6, quantity: { amount: 2 } },
        { id: 7, quantity: { amount: 3 } },
      ],
    };
    const ingredients = [
      { id: 6, estimatedCostInCents: 150 },
      { id: 7, estimatedCostInCents: 200 },
    ];
    const totalCost = calculateCost(recipe, ingredients);
    const expectedTotalCost = (2 * 150 + 3 * 200) / 100;
    expect(totalCost).to.equal(expectedTotalCost);
  });
  
  //sad path
  it("should throw an error if ingredient id does not exist", () => {
    const recipe = {
      id: 2,
      ingredients: [{ id: 2, quantity: { amount: 1 } }],
    };
    const ingredients = [{ id: 1, estimatedCostInCents: 100 }];
    try {
      calculateCost(recipe, ingredients);
      expect.fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).to.equal("Ingredient not found");
    }
  });
});