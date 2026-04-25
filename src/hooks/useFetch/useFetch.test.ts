import {act, renderHook} from '@testing-library/react';
import useFetch from './useFetch';

describe('useFetch', () => {
    test('fetches data successfully', async () => {
        const mockData = { message: 'Hello, World!' };
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData),
        });

        const { result } = renderHook(() => useFetch('https://api.example.com/data'));

        expect(result.current.loading).toBe(true);

        await act(async () => {});

        expect(result.current.data).toEqual(mockData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    test('handles fetch error', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });

        const { result } = renderHook(() => useFetch('https://api.example.com/data'));

        expect(result.current.loading).toBe(true);

        await act(async () => {});

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('error');
    });

    test('handles fetch exception', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useFetch('https://api.example.com/data'));

        expect(result.current.loading).toBe(true);

        await act(async () => {});

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Network error');
    });

    test('does not fetch when url is null', () => {
        global.fetch = jest.fn();

        const { result } = renderHook(() => useFetch(null));

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(global.fetch).not.toHaveBeenCalled();
    });
});