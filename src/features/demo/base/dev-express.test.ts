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

  it("Should select checkbox and select 7", (done) => {
    (async () => {
      const checkboxSelector = 'input[type="checkbox"][name="tried-test-cafe"]';

      await page.waitForSelector(checkboxSelector);

      await page.click(checkboxSelector);

      const isChecked = await page.$eval(
        checkboxSelector,
        (checkbox) => checkbox.checked
      );
      expect(isChecked).toBe(true);

      const sliderSelector = "#slider";

      const slider = await page.$(sliderSelector);
      if (!slider) {
        done();
        throw new Error("Slider not found");
      }

      const boundingBox = await slider?.boundingBox();

      if (!boundingBox) {
        done();
        throw new Error("Slider container not found");
      }
      const sliderWidth = boundingBox.width;

      const minValue = 0;
      const maxValue = 10;
      const targetValue = 7;

      const positionRatio = (targetValue - minValue) / (maxValue - minValue);
      const targetPosition = boundingBox.x + positionRatio * sliderWidth;

      const handleY = boundingBox.y + boundingBox.height / 2;

      await page.mouse.move(boundingBox.x + boundingBox.width / 2, handleY);
      await page.mouse.down();
      await page.mouse.move(targetPosition, handleY, { steps: 10 });
      await page.mouse.up();

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
