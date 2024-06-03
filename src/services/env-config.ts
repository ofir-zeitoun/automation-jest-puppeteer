import dotenv from "dotenv";

dotenv.config();

type Env = {
  HEADLESS: boolean;
  DEVTOOLS: boolean;
  SLOW_MO: number;
  VIEWPORT_WIDTH: number;
  VIEWPORT_HEIGHT: number;
  // TIMEOUT: number;
  INCOGNITO: boolean;
};

function getEnv<Key extends keyof Env>(
  key: Key,
  defaultValue: Env[Key],
  parse: (value: string) => Env[Key]
): Env[Key] {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return parse(value);
}

export const env = {
  headless: getEnv("HEADLESS", true, (value) => value === "true"),
  devtools: getEnv("DEVTOOLS", false, (value) => value === "true"),
  //   headless: process.env.HEADLESS === "false" ? false : true,
  slowMo: getEnv("SLOW_MO", 0, parseInt),
  // timeout: getEnv("TIMEOUT", 1_000, parseInt),
  viewport: {
    width: getEnv("VIEWPORT_WIDTH", 1080, parseInt),
    height: getEnv("VIEWPORT_HEIGHT", 1024, parseInt),
  },
  incognito: getEnv("INCOGNITO", true, (value) => value === "true"),
};
