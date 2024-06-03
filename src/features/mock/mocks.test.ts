import { jest } from "@jest/globals";
import { add } from "./example";

jest.mock("./example", () => {
  const originalModule = jest.requireActual("./example");

  //Mock the named export 'add'
  return {
    __esModule: true,
    //@ts-ignore
    ...originalModule,
    add: jest.fn((a: number, b: number) => a * b),
  };
});

describe("mock module example", () => {
  it("should not return 3", () => {
    expect(add(1, 2)).toBe(2);
  });
});
