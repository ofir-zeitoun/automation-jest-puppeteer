import assert from "assert";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import { env } from "../../services";
import {
  Given,
  When,
  Then,
  After,
  AfterAll,
  BeforeAll,
} from "@cucumber/cucumber";

function parsePostData(postData: string) {
  const result: Record<string, string> = {};
  const params = new URLSearchParams(postData);
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

let browser: Browser;
let page: Page;
let postData: Record<string, string>;

BeforeAll(async function () {
  browser = await puppeteer.launch({
    headless: env.headless,
    slowMo: env.slowMo,
    devtools: env.devtools,
  });
});

AfterAll(async function () {
  await browser.close();
});

After(async function () {
  page?.isClosed() || (await page?.close());
});

Given("I open a site {string}", async function (site: string) {
  page = await browser.newPage();
  await page.setViewport(env.viewport);
  await page.goto(site);
});

When(
  "I type {string} into selector {string}",
  async function (text: string, selector: string) {
    await page.type(selector, text, { delay: 100 });
  }
);

When("I click on selector {string}", async function (selector: string) {
  await page.click(selector);
});

When("I wait for response", function () {
  page.on("request", async function (request) {
    const postDataStr = request.postData();
    postData = parsePostData(postDataStr || "");
  });
});

When("I submit a form on {string}", async function (selector: string) {
  const [response] = await Promise.all([
    page.waitForNavigation(),
    page.click(selector),
  ]);
  const postDataStr = response?.request().postData();
  postData = parsePostData(postDataStr || "");
});

Then(
  "data should have {string} with {string}",
  async function (key: string, value: string) {
    assert.equal(postData?.[key], value);
  }
);

Then("The element {string} should exist", async function (selector: string) {
  const found = await page.waitForSelector(selector);
  assert.ok(found);
});
