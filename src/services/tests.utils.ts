import puppeteer, { Browser, Page } from "puppeteer";
import { Nullable } from "../../@types";
import { env } from "./env-config";

type PuppeteerHandles = { browser: Browser; page: Page };

export function createTestsUtil(site: string): PuppeteerHandles {
  const res: Nullable<PuppeteerHandles> = {
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
    await res.page.setViewport(env.viewport);
    await res.page.goto(site);
  });

  afterEach(async () => {
    await res.page!.close();
    res.page = null;
  });

  afterAll(async () => {
    await res.browser!.close();
    res.browser = null;
  });

  return res as PuppeteerHandles;
}
