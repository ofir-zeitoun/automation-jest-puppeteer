import puppeteer, { Browser, Page } from "puppeteer";
import { env, wait } from "../../../services";

const site = "https://cgi-lib.berkeley.edu/ex/simple-form.html";

function parsePostData(postData: string) {
  const result: Record<string, string> = {};
  const params = new URLSearchParams(postData);
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

describe("simple-form example", () => {
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

  it("post data", (done) => {
    (async () => {
      const inputName = "John Doe";
      await page.type("body > form > input[name='name']", inputName);

      // option #1
      // page.on("request", async (request) => {
      //   const postData = request.postData();
      //   console.log("🚀 ~ postData:", postData);
      //   done();
      // });

      // option #2
      // page.on("response", async (response) => {
      //   let request = response.request();
      //   let url = request.url();
      //   console.log("🚀 ~ page.on ~ url:", url)
      //   let method = request.method();
      //   let postData = request.postData();
      //   if (method === "POST") {
      //     console.log(postData); // this returns undefined
      //     done();
      //   }
      // });

      // option #3
      const [response] = await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        page.click("input[type=submit]"), // Clicking the link will indirectly cause a navigation
      ]);
      const postData = response?.request().postData();
      const data = parsePostData(postData || "");
      // console.log(response?.request().postData());
      expect(data.name).toBe(inputName);
      done();
    })();
  });
});
