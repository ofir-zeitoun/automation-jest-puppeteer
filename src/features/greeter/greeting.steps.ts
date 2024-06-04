import assert from "assert";
import { When, Then } from "@cucumber/cucumber";
import { sayHello } from "./greeter";

When("the greeter says hello {string}", function (name: string) {
  //@ts-ignore
  this.whatIHeard = sayHello(name);
});

Then("I should have heard {string}", function (expectedResponse: string) {
  //@ts-ignore
  assert.equal(this.whatIHeard, expectedResponse);
});
