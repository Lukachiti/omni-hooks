import { renderHook, act } from '@testing-library/react';
import useIdle from './useIdle';

describe('useIdle', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test('should be idle after specified time', () => {
        const { result } = renderHook(() => useIdle(1000));
        expect(result.current).toBe(false);

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(result.current).toBe(true);
    });

    test('should reset idle timer on activity', () => {
        const { result } = renderHook(() => useIdle(1000));
        expect(result.current).toBe(false);
        act(() => {
            jest.advanceTimersByTime(500);
        });
        expect(result.current).toBe(false);
        act(() => {
            jest.advanceTimersByTime(500);
        });
        expect(result.current).toBe(true);
    });

    test('should reset idle state on activity', () => {
        const { result } = renderHook(() => useIdle(1000));
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(result.current).toBe(true);
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
        });
        expect(result.current).toBe(false);
    });
});
        