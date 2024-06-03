import type { Page } from "puppeteer";
import { createTestsUtil } from "../../../services";

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

describe("dev-express util example", () => {
  const instance = createTestsUtil(site);

  it("util should click on #7", (done) => {
    (async () => {
      await instance.page.click("label[for='tried-test-cafe']");
      await instance.page.waitForSelector("div.slider-values.active");
      const slider = await instance.page.waitForSelector("div.slider-value");
      if (!slider) {
        done();
        throw new Error("Slider not found");
      }

      await clickOnElement(instance.page, "#slider", 70);
      done();
    })();
  });

  it("should have 5 features", (done) => {
    (async () => {
      const featuresCount = await instance.page!.$$eval(
        "div.col-1 > fieldset > p > label > input",
        (elements) => elements.length
      );
      expect(featuresCount).toBe(5);
      done();
    })();
  });
});
