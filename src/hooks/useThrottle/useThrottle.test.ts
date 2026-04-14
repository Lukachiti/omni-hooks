import { renderHook, act } from "@testing-library/react";
import { useThrottle } from "./useThrottle";
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
describe("useThrottle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-14"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should update value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: "v1" } },
    );

    rerender({ value: "v2" });
    expect(result.current).toBe("v1");
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("v2");
  });
});