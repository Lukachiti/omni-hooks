import { renderHook, act } from '@testing-library/react';
import usePrevious from './usePrevious';

describe('usePrevious', () => {

    test('should return undefined as previous on first render', () => {
        const { result } = renderHook(() => usePrevious('hello'));
        expect(result.current.previous).toBeUndefined();
    });

    test('should track previous value after rerender', () => {
        const { result, rerender } = renderHook(
            (value) => usePrevious(value),
            { initialProps: 'first' }
        );
        rerender('second');
        expect(result.current.previous).toBe('first');
    });

    test('should undo to previous value', () => {
        const { result, rerender } = renderHook(
            (value) => usePrevious(value),
            { initialProps: 'a' }
        );
        rerender('b');
        act(() => { result.current.undo(); });
        expect(result.current.pointer).toBe(0);
    });

    test('should redo after undo', () => {
        const { result, rerender } = renderHook(
            (value) => usePrevious(value),
            { initialProps: 'a' }
        );
        rerender('b');
        act(() => { result.current.undo(); });
        act(() => { result.current.redo(); });
        expect(result.current.pointer).toBe(1);
    });

    test('should respect historySize limit', () => {
        const { result, rerender } = renderHook(
            (value) => usePrevious(value, { historySize: 3 }),
            { initialProps: 'a' }
        );
        rerender('b');
        rerender('c');
        rerender('d');
        expect(result.current.history.length).toBeLessThanOrEqual(3);
    });

    test('resetHistory should keep only current value', () => {
        const { result, rerender } = renderHook(
            (value) => usePrevious(value),
            { initialProps: 'a' }
        );
        rerender('b');
        rerender('c');
        act(() => { result.current.resetHistory(); });
        expect(result.current.history.length).toBe(1);
    });

    test('clear should reset to initialValue', () => {
        const { result, rerender } = renderHook(
            (value) => usePrevious(value, { initialValue: 'start' }),
            { initialProps: 'a' }
        );
        rerender('b');
        act(() => { result.current.clear(); });
        expect(result.current.history[0]).toBe('start');
    });

  });