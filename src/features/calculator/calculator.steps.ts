//@ts-ignore
const { Given, When, Then } = require("@cucumber/cucumber");
//@ts-ignore
const assert = require("assert");
const { add } = require("./calculator");

let first: number;
let sum: number;

Given("first number is {int}", function (firstNumber: number) {
  first = firstNumber;
});

When("I add {int}", function (secondNumber: number) {
  sum = add(first, secondNumber);
});

Then("I should get {int}", function (expectedResult: number) {
  assert.equal(sum, expectedResult);
});
