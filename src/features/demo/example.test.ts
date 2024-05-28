import puppeteer from "puppeteer";
import { env } from "../../services/env-config";
console.log("🚀 ~ config:", env);

describe("First test", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });

  it("should pass async", (done) => {
    (async () => {
      expect(true).toBe(true);
      done();
    })();
  });
});

describe("Puppeteer tests", () => {
  it("should open a browser", (done) => {
    (async () => {
      done();
      return;
      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 75,
      });
      const page = await browser.newPage();

      // Navigate the page to a URL
      await page.goto("https://developer.chrome.com/");

      // Set screen size
      await page.setViewport({ width: 1080, height: 1024 });

      // Type into search box
      await page.type(".devsite-search-field", "automate beyond recorder");

      // Wait and click on first result
      const searchResultSelector = ".devsite-result-item-link";
      const found = await page.waitForSelector(searchResultSelector);
      expect(found).toBeTruthy();
      await browser.close();
      done();
    })();
  }, 15_000);
});
