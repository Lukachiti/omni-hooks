import { renderHook, act } from "@testing-library/react";
import useObject from "./useObject";

describe("useObject Hook", () => {
    test("should initialize with an object", () => {
        const initialData = { key: "value" };
        const { result } = renderHook(() => useObject(initialData));

        expect(result.current.obj).toEqual(initialData);
    });

    test("should update object properties", () => {
        const initialData = { key: "value" };
        const { result } = renderHook(() => useObject(initialData));

        act(() => {
            result.current.set({ key: "newValue" });
        });

        expect(result.current.obj).toEqual({ key: "newValue" });
    });

    test("should reset to initial object", () => {
        const initialData = { key: "value" };
        const { result } = renderHook(() => useObject(initialData));

        act(() => {
            result.current.set({ key: "newValue" });
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.obj).toEqual(initialData);
    });

    test("should update nested object properties", () => {
        const initialData = { key: { nestedKey: "nestedValue" } };
        const { result } = renderHook(() => useObject(initialData));

        act(() => {
            result.current.set({ key: { nestedKey: "newNestedValue" } });
        });

        expect(result.current.obj).toEqual({ key: { nestedKey: "newNestedValue" } });
    });

    test("should update multiple properties at once", () => {
        const initialData = { key1: "value1", key2: "value2" };
        const { result } = renderHook(() => useObject(initialData));

        act(() => {
            result.current.set({ key1: "newValue1", key2: "newValue2" });
        });

        expect(result.current.obj).toEqual({ key1: "newValue1", key2: "newValue2" });
    });
});