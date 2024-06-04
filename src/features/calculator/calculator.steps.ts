//@ts-ignore
const { Given, When, Then } = require("@cucumber/cucumber");
//@ts-ignore
const assert = require("assert");
const { add, subtract } = require("./calculator");

let first: number;
let second: number;

Given("first number is {int}", function (firstNumber: number) {
  first = firstNumber;
});

When("second number is {int}", function (secondNumber: number) {
  second = secondNumber;
});

Then("Their sum should be {int}", function (expectedResult: number) {
  const sum = add(first, second);
  assert.equal(sum, expectedResult);
});

Then("Their diff should be {int}", function (expectedResult: number) {
  const sum = subtract(first, second);
  assert.equal(sum, expectedResult);
});
