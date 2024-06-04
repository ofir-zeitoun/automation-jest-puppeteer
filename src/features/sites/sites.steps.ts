import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import { env } from "../../services";

//@ts-ignore
const { Given, When, Then } = require("@cucumber/cucumber");
const { After, Before, AfterAll, BeforeAll } = require("@cucumber/cucumber");

//@ts-ignore
const assert = require("assert");

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

BeforeAll(async () => {
  browser = await puppeteer.launch({
    headless: env.headless,
    slowMo: env.slowMo,
    devtools: env.devtools,
  });
});

AfterAll(async () => {
  await browser.close();
});

After(async () => {
  await page?.close();
});

Given("I open a site {string}", async (site: string) => {
  page = await browser.newPage();
  await page.goto(site);
  await page.setViewport(env.viewport);
});

When(
  "I type {string} into selector {string}",
  async (text: string, selector: string) => {
    await page.type(selector, text, { delay: 100 });
  }
);

When("I click on selector {string}", async (selector: string) => {
  await page.click(selector);
});

When("I wait for response", () => {
  page.on("request", async (request) => {
    const postDataStr = request.postData();
    postData = parsePostData(postDataStr || "");
  });
});

When("I submit a form on {string}", async (selector: string) => {
  const [response] = await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click("input[type=submit]"), // Clicking the link will indirectly cause a navigation
  ]);
  const postDataStr = response?.request().postData();
  postData = parsePostData(postDataStr || "");
});

Then(
  "data should have {string} with {string}",
  async (key: string, value: string) => {
    assert.equal(postData?.[key], value);
  }
);
