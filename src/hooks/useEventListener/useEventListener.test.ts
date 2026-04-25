import {act, renderHook} from '@testing-library/react';
import useEventListener from './useEventListener';

describe('useEventListener', () => {
    test('should add and remove event listener', () => {
        const callback = jest.fn();
        const { unmount } = renderHook(() => useEventListener('click', callback));

        act(() => {
            window.dispatchEvent(new MouseEvent('click'));
        })

        expect(callback).toHaveBeenCalledTimes(1);

        unmount(); 
        act(() => {
            window.dispatchEvent(new MouseEvent('click'));
        })
        expect(callback).toHaveBeenCalledTimes(1);
    });
    test('should work with elementRef', () => {
        const callback = jest.fn();
        const element = document.createElement('div');
        document.body.appendChild(element);
        const elementRef = { current: element };
        const { unmount } = renderHook(() => useEventListener('click', callback, elementRef));

        act(() => {
            element.dispatchEvent(new MouseEvent('click'));
        })
        expect(callback).toHaveBeenCalledTimes(1);
        unmount();
        act(() => {
            element.dispatchEvent(new MouseEvent('click'));
        })
        expect(callback).toHaveBeenCalledTimes(1);

        document.body.removeChild(element);
    });
});