import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
    test('calls handler when clicking outside', () => {
        const handler = jest.fn();

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(document.createElement('div'));
            useClickOutside(ref as any, handler);
        });

        act(() => {
            document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        });

        expect(handler).toHaveBeenCalled();
    });

    test('does NOT call handler when clicking inside', () => {
        const handler = jest.fn();

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(document.createElement('div'));
            useClickOutside(ref as any, handler);
            return ref;
        });

        act(() => {
            const event = new MouseEvent('mousedown', { bubbles: true });
            Object.defineProperty(event, 'target', { value: result.current.current });
            document.dispatchEvent(event);
        });

        expect(handler).not.toHaveBeenCalled();
    });

    test('does NOT call handler when disabled', () => {
        const handler = jest.fn();

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(document.createElement('div'));
            useClickOutside(ref as any, handler, { enabled: false });
        });

        act(() => {
            document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        });

        expect(handler).not.toHaveBeenCalled();
    });
});