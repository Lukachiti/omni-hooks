import {act,renderHook} from "@testing-library/react";
import useArray from "./useArr";

describe("useArray", () => {
    test("initializes with default array", () => {
        const { result } = renderHook(() => useArray([1, 2, 3]));
        expect(result.current.array).toEqual([1, 2, 3]);
    });
    test("pushes items to array", () => {
        const { result } = renderHook(() => useArray<number>());
        act(() => {
            result.current.push(1);
            result.current.push([2, 3]);
        }
        );
        expect(result.current.array).toEqual([1, 2, 3]);
    });
    test("removes items by index", () => {
        const { result } = renderHook(() => useArray([1, 2, 3]));
        act(() => {
            result.current.remove(1);
        });
        expect(result.current.array).toEqual([1, 3]);
    });
    test("resets to initial array", () => {
        const { result } = renderHook(() => useArray([1, 2, 3]));
        act(() => {
            result.current.push(4);
            result.current.reset();
        }
        );
        expect(result.current.array).toEqual([1, 2, 3]);
    });
    test("clears the array", () => {
        const { result } = renderHook(() => useArray([1, 2, 3]));
        act(() => {
            result.current.clear();
        });
        expect(result.current.array).toEqual([]);
    });
    test("filters the array", () => {
        const { result } = renderHook(() => useArray([1, 2, 3, 4]));
        act(() => {
            result.current.filter((item) => item % 2 === 0);
        });
        expect(result.current.array).toEqual([2, 4]);
    });
});