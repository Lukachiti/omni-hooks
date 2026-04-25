import {act, renderHook} from '@testing-library/react';
import useModal from './useModal';

describe('useModal', () => {
    test('initializes with isOpen false', () => {
        const { result } = renderHook(() => useModal());
        expect(result.current.isOpen).toBe(false);
    });

    test('open sets isOpen to true', () => {
        const { result } = renderHook(() => useModal());
        act(() => {
            result.current.openModal();
        });
        expect(result.current.isOpen).toBe(true);
    });

    test('close sets isOpen to false', () => {
        const { result } = renderHook(() => useModal());
        act(() => {
            result.current.openModal();
        });

        expect(result.current.isOpen).toBe(true);

        act(() => {            
            result.current.closeModal();
        });

        expect(result.current.isOpen).toBe(false);
    });

    test('toggle toggles isOpen state', () => {
        const { result } = renderHook(() => useModal());

        expect(result.current.isOpen).toBe(false);

        act(() => {
            result.current.toggleModal();
        });
        expect(result.current.isOpen).toBe(true);

        act(() => {
            result.current.toggleModal();
        });

        expect(result.current.isOpen).toBe(false);
    });
});