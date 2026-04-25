import {act, renderHook} from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
    
    test('returns the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));

        expect(result.current).toBe('initial');
    });

    test('returns the debounced value after delay', () => {
        jest.useFakeTimers();
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        rerender({ value: 'updated', delay: 500 });

        
        expect(result.current).toBe('initial');
        
        act(() => {
            jest.advanceTimersByTime(500);
        });
    
        expect(result.current).toBe('updated');
        jest.useRealTimers();
    });

    test('resets the timer if value changes before delay', () => {
        jest.useFakeTimers();
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );
        rerender({ value: 'updated1', delay: 500 });
        act(() => {
            jest.advanceTimersByTime(300);
        });
        
        expect(result.current).toBe('initial');
        rerender({ value: 'updated2', delay: 500 });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(result.current).toBe('updated2');
        jest.useRealTimers();
    });
});