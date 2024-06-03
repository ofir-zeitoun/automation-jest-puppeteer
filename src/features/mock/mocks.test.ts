import { jest } from "@jest/globals";
import { add, subtract, asyncAdd, increment } from "./example";

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

  it("subtracts two numbers", () => {
    const subtractMock = jest.fn(subtract);
    subtractMock(4, 3);
    expect(subtractMock).toHaveBeenCalledWith(4, 3);
    expect(subtractMock).toHaveReturnedWith(1);
  });

  it("should return 3 async", (done) => {
    const mockAsyncAdd = jest.fn(asyncAdd).mockResolvedValue(3);
    (async () => {
      expect(await mockAsyncAdd(10, 5)).toBe(3);
      done();
    })();
  });

  it("increment gets called multiple times", () => {
    const incrementMock = jest.fn(increment);
    incrementMock(1);
    incrementMock(2);
    incrementMock(3);

    expect(incrementMock).toHaveBeenCalledTimes(3);
    expect(incrementMock).toHaveBeenCalledWith(1);
    expect(incrementMock).toHaveBeenCalledWith(2);
    expect(incrementMock).toHaveBeenCalledWith(3);
  });
});
