import puppeteer, { Browser, Page } from "puppeteer";
import { env } from "../../../services";

const site = "https://developer.chrome.com/";

describe("split example", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: env.headless,
      slowMo: env.slowMo,
      devtools: env.devtools,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(site);
    await page.setViewport(env.viewport);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should search for 'automate beyond recorder' and click on first result", (done) => {
    (async () => {
      await page.type(".devsite-search-field", "automate beyond recorder");
      // Wait and click on first result
      const searchResultSelector = ".devsite-result-item-link";
      const found = await page.waitForSelector(searchResultSelector);
      expect(found).toBeTruthy();
      done();
    })();
  });
  // env.timeout

  it("should click on 'Get Started' button", (done) => {
    (async () => {
      await page.click(".devsite-landing-row-header-buttons");
      expect(page.url()).toContain(
        "features-tools-and-programs-to-make-developers-successful-on-the-web"
      );
      done();
    })();
  });
});
