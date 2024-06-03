//@ts-ignore
const { Given, When, Then } = require("@cucumber/cucumber");
//@ts-ignore
const assert = require("assert");
const { sayHello } = require("./greeter");

When("the greeter says hello {string}", function (name: string) {
  //@ts-ignore
  this.whatIHeard = sayHello(name);
});

Then("I should have heard {string}", function (expectedResponse: string) {
  //@ts-ignore
  assert.equal(this.whatIHeard, expectedResponse);
});
