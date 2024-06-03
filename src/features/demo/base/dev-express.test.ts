import puppeteer, { Browser, Page } from "puppeteer";
import { env } from "../../../services";

const site = "https://devexpress.github.io/testcafe/example/";

async function clickOnElement(page: Page, selector: string, percent: number) {
  const rect = await page.$eval(selector, (el) => {
    const { top, left, width, height } = el.getBoundingClientRect();
    return { top, left, width, height };
  });

  // Use given position or default to center
  const x = (rect.width * percent) / 100;
  const y = rect.height / 2;

  await page.mouse.click(rect.left + x, rect.top + y);
}

describe("dev-express example", () => {
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

  it("should click on #7", (done) => {
    (async () => {
      await page.click("label[for='tried-test-cafe']");
      await page.waitForSelector("div.slider-values.active");
      const slider = await page.waitForSelector("div.slider-value");
      if (!slider) {
        done();
        throw new Error("Slider not found");
      }

      await clickOnElement(page, "#slider", 70);
      // await page.click("div.slider-value:contains('7')"); // doesn't work because range is in other element

      // works :-/ but the range is in other element
      // const found = await page.$$eval("div.slider-value", (elements) => {
      //   const no7 = elements.find((element) => element.textContent === "7");
      //   no7?.click();
      //   alert(`🚀 ~ name ${no7?.className} ${no7?.textContent}`);
      //   return !!no7;
      // });
      // expect(found).toBe(true);
      done();
    })();
  });

  it("should have 5 features", (done) => {
    (async () => {
      const featuresCount = await page.$$eval(
        "div.col-1 > fieldset > p > label > input",
        (elements) => elements.length
      );
      expect(featuresCount).toBe(5);
      done();
    })();
  });
});
