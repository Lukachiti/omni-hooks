import {act, renderHook} from '@testing-library/react';
import useCopy from './useCopy';

beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: jest.fn().mockResolvedValue(undefined),
        },
        configurable: true,
        writable: true,
    });
});

describe('useCopy', () => {
    test('copies text to clipboard', async () => {
        const { result } = renderHook(() => useCopy());

        const success = await act(async () => result.current.copy('Hello, World!'));

        expect(success).toBe(true);
    });

    test('handles copy failure', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: jest.fn().mockRejectedValue(new Error('Copy failed')),
            },
            configurable: true,
        });

        const { result } = renderHook(() => useCopy());

        const success = await act(async () => result.current.copy('Hello, World!'));

        expect(success).toBe(false);
    });

    test('resets copied state after timeout', async () => {
        jest.useFakeTimers();

        const { result } = renderHook(() => useCopy(1000));

        await act(async () => result.current.copy('Hello, World!'));

        expect(result.current.copied).toBe(true);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.copied).toBe(false);

        jest.useRealTimers();
    });

    test('reset function clears copied state', async () => {
        const { result } = renderHook(() => useCopy());

        await act(async () => result.current.copy('Hello, World!'));

        expect(result.current.copied).toBe(true);

        act(() => result.current.reset());

        expect(result.current.copied).toBe(false);
    });
});