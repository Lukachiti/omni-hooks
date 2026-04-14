import { renderHook, act } from '@testing-library/react';
import useForm from './useForm';

describe('useForm', () => {

    test('should return empty values on first render', () => {
        const { result } = renderHook(() => useForm());
        expect(result.current.getValues()).toEqual({});
    });

    test('should update value on change', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username');
            onChange({ target: { type: 'text', value: 'john', tagName: 'INPUT' } } as any);
        });

        expect(result.current.getValues().username).toBe('john');
    });

    test('should set required error if field is empty', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username', { required: true });
            onChange({ target: { type: 'text', value: '', tagName: 'INPUT' } } as any);
        });

        expect(result.current.formState.errors.username).toBe('This field is required');
    });

    test('should set minLength error', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username', { minLength: 5 });
            onChange({ target: { type: 'text', value: 'ab', tagName: 'INPUT' } } as any);
        });

        expect(result.current.formState.errors.username).toBe('Minimum length is 5');
    });

    test('should set maxLength error', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username', { maxLength: 3 });
            onChange({ target: { type: 'text', value: 'toolong', tagName: 'INPUT' } } as any);
        });

        expect(result.current.formState.errors.maxLength).toBeUndefined();
        expect(result.current.formState.errors.username).toBe('Maximum length is 3');
    });

    test('should set pattern error', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('email', { pattern: /^\S+@\S+\.\S+$/ });
            onChange({ target: { type: 'text', value: 'notanemail', tagName: 'INPUT' } } as any);
        });

        expect(result.current.formState.errors.email).toBe('Invalid format');
    });

    test('should clear error when valid value is entered', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username', { required: true });
            onChange({ target: { type: 'text', value: '', tagName: 'INPUT' } } as any);
        });

        expect(result.current.formState.errors.username).toBe('This field is required');

        act(() => {
            const { onChange } = result.current.register('username', { required: true });
            onChange({ target: { type: 'text', value: 'john', tagName: 'INPUT' } } as any);
        });

        expect(result.current.formState.errors.username).toBeUndefined();
    });

    test('should reset all values and errors', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username');
            onChange({ target: { type: 'text', value: 'john', tagName: 'INPUT' } } as any);
        });

        act(() => { result.current.reset(); });

        expect(result.current.getValues()).toEqual({});
        expect(result.current.formState.errors).toEqual({});
    });

    test('should watch a field value', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username');
            onChange({ target: { type: 'text', value: 'john', tagName: 'INPUT' } } as any);
        });

        expect(result.current.watch('username')).toBe('john');
    });

    test('should call callback on valid submit', () => {
        const { result } = renderHook(() => useForm());
        const mockCallback = jest.fn();

        act(() => {
            const { onChange } = result.current.register('username', { required: true });
            onChange({ target: { type: 'text', value: 'john', tagName: 'INPUT' } } as any);
        });

        act(() => {
            result.current.handleSubmit(mockCallback)();
        });

        expect(mockCallback).toHaveBeenCalledWith({ username: 'john' });
    });

    test('should not call callback on invalid submit', () => {
        const { result } = renderHook(() => useForm());
        const mockCallback = jest.fn();

        act(() => {
            result.current.register('username', { required: true });
        });

        act(() => {
            result.current.handleSubmit(mockCallback)();
        });

        expect(mockCallback).not.toHaveBeenCalled();
    });

    test('clearErrors should clear all errors', () => {
        const { result } = renderHook(() => useForm());

        act(() => {
            const { onChange } = result.current.register('username', { required: true });
            onChange({ target: { type: 'text', value: '', tagName: 'INPUT' } } as any);
        });

        act(() => { result.current.clearErrors(); });

        expect(result.current.formState.errors).toEqual({});
    });

});