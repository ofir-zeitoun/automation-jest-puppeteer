import assert from "assert";
import { When, Then, defineParameterType } from "@cucumber/cucumber";

import { sayHello } from "./greeter";

type Color = "red" | "blue" | "yellow";

defineParameterType({
  name: "color",
  regexp: /red|blue|yellow/,
  transformer: (s) => s as Color,
});

When("the greeter says hello {string}", function (name: string) {
  this.parameters.whatIHeard = sayHello(name);
});

Then("I should have heard {string}", function (expectedResponse: string) {
  assert.equal(this.parameters.whatIHeard, expectedResponse);
});

Then("I should paint {color}", function (color: Color) {
  assert.ok(["red", "blue", "yellow"].includes(color));
});
