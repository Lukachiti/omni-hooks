import { renderHook } from "@testing-library/react";
import useObject from "./useObject";

describe("useObject Hook", () => {
  it("should initialize with an object", () => {
    const initialData = { key: "value" };
    const { result } = renderHook(() => useObject(initialData));

    expect(result.current.obj).toEqual(initialData);
  });
});