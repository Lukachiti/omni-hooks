import {renderHook } from '@testing-library/react';
import useUpdateEffect from './useUpdateEffect';


describe('useUpdateEffect', () => {
    test('does not run effect on initial render', () => {
        const effect = jest.fn();
        renderHook(() => useUpdateEffect(effect, []));
        expect(effect).not.toHaveBeenCalled();
    });

    test('runs effect on subsequent renders when dependency changes', () => {
        const effect = jest.fn();
        const { rerender } = renderHook(
            ({ trigger }) => useUpdateEffect(effect, [trigger]),
            { initialProps: { trigger: false } }
        );
        
        // Rerender with changed dependency
        rerender({ trigger: true });
        expect(effect).toHaveBeenCalledTimes(1);
    });

    test('runs effect when dependencies change', () => {
        const effect = jest.fn();
        const { rerender } = renderHook(
            ({ count }) => useUpdateEffect(effect, [count]),
            { initialProps: { count: 0 } }
        );
        rerender({ count: 1 });
        expect(effect).toHaveBeenCalledTimes(1);
    });

    test('does not run effect when dependencies do not change', () => {
        const effect = jest.fn();
        const { rerender } = renderHook(
            ({ count }) => useUpdateEffect(effect, [count]),
            { initialProps: { count: 0 } }
        );
        rerender({ count: 0 });
        expect(effect).not.toHaveBeenCalled();
    });

    test('cleanup function is called on unmount', () => {
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);

        const { unmount, rerender } = renderHook(
            ({ trigger }) => useUpdateEffect(effect, [trigger]),
            { initialProps: { trigger: false } }
        );
        
        
        rerender({ trigger: true });
        
        
        unmount();
        expect(cleanup).toHaveBeenCalled(); 
    });
});