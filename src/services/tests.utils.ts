import puppeteer, { Browser, Page } from "puppeteer";
import { env } from "./env-config";

export function createTestsUtil(site: string): {
  browser: Browser;
  page: Page;
} {
  const res: {
    browser: Browser | null;
    page: Page | null;
  } = {
    browser: null,
    page: null,
  };

  beforeAll(async () => {
    res.browser = await puppeteer.launch({
      headless: env.headless,
      slowMo: env.slowMo,
      devtools: env.devtools,
      ...(env.incognito && { args: ["--incognito"] }),
    });
  });

  beforeEach(async () => {
    res.page = await res.browser!.newPage();
    await res.page.goto(site);
    await res.page.setViewport(env.viewport);
  });

  afterEach(async () => {
    await res.page!.close();
    res.page = null;
  });

  afterAll(async () => {
    await res.browser!.close();
    res.browser = null;
  });

  return res;
}
