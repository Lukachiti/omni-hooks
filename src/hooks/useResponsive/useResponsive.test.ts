import { renderHook, act } from "@testing-library/react";
import useResponsive from "./useResponsive";

describe("useResponsive", () => {
    beforeAll(() => {
        Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
            matches: query === "(min-width: 768px)",
            media: query,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        })),
        });
    });

    test("should return initial width and matches", () => {
        window.innerWidth = 800;

        const { result } = renderHook(() =>
            useResponsive("(min-width: 768px)")
        );

        expect(result.current.width).toBe(800);
        expect(result.current.matches).toBe(true);
    });

    test("should update width on resize", () => {
        const { result } = renderHook(() =>
            useResponsive("(min-width: 768px)")
        );

        act(() => {
            window.innerWidth = 500;
            window.dispatchEvent(new Event("resize"));
        });

        expect(result.current.width).toBe(500);
    });
});