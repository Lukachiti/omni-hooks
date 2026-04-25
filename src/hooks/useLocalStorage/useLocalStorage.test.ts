import {renderHook,act} from "@testing-library/react";
import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    afterEach(() => {
        localStorage.clear();
    }
    );

    test("initializes with default value if no localStorage entry", () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "default"));
        expect(result.current.value).toBe("default");
    });

    test("initializes with localStorage value if present", () => {
        localStorage.setItem("testKey", JSON.stringify({ value: "storedValue" }));
        const { result } = renderHook(() => useLocalStorage("testKey", "default"));
        expect(result.current.value).toBe("storedValue");
    }); 

    test("updates value and localStorage when setValue is called", () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "default"));
        act(() => {
            result.current.setValue("newValue");
        });
        expect(result.current.value).toBe("newValue");
        const stored = JSON.parse(localStorage.getItem("testKey") || "{}");
        expect(stored.value).toBe("newValue");
    });

    test("removes localStorage entry and resets value when remove is called", () => {
        localStorage.setItem("testKey", JSON.stringify({ value: "storedValue" }));
        const { result } = renderHook(() => useLocalStorage("testKey", "default"));

        expect(result.current.value).toBe("storedValue");

        act(() => {
            result.current.remove();
        });

        expect(result.current.value).toBe("default");
        expect(localStorage.getItem("testKey")).toBeNull();
    });
});