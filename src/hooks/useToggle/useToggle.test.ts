import { renderHook, act } from '@testing-library/react';
import useToggle from './useToggle';

describe('useToggle', () => {
    const key = 'test-toggle';

    beforeEach(() => {
        localStorage.clear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('should initialize with default value', () => {
        const { result } = renderHook(() => useToggle(key, false));
        expect(result.current.value).toBe(false);
        expect(result.current.history).toEqual([false]);
    });

    test('should toggle value and update history', () => {
        const { result } = renderHook(() => useToggle(key, false));

        act(() => {
            result.current.toggle();
        });

        expect(result.current.value).toBe(true);
        expect(result.current.history).toEqual([false, true]);
    });

    test('should undo to previous value', () => {
        const { result } = renderHook(() => useToggle(key, false));

        act(() => {
            result.current.toggle();
            result.current.toggle();
        });

        expect(result.current.value).toBe(false);

        act(() => {
            result.current.undo();
        });

        expect(result.current.value).toBe(true);
        expect(result.current.history).toEqual([false, true]);
    });

    test('should respect the locked state', () => {
        const { result } = renderHook(() => useToggle(key, false));

        act(() => {
            result.current.toggleLocked();
        });

        expect(result.current.locked).toBe(true);

        act(() => {
            result.current.toggle();
        });

        expect(result.current.value).toBe(false);
    });

    test('should toggle after a delay using toggleAfter', () => {
        const { result } = renderHook(() => useToggle(key, false));

        act(() => {
            result.current.toggleAfter(1000);
        });

        expect(result.current.value).toBe(false);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.value).toBe(true);
    });

    test('should reset to initial state', () => {
        const { result } = renderHook(() => useToggle(key, false));

        act(() => {
            result.current.toggle();
            result.current.reset();
        });

        expect(result.current.value).toBe(false);
        expect(result.current.history).toEqual([false]);
    });
});