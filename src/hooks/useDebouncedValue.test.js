import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns the initial value immediately', () => {
        const { result } = renderHook(() => useDebouncedValue('a', 300));
        expect(result.current).toBe('a');
    });

    it('does not update before the delay has elapsed', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
            initialProps: { value: 'a' },
        });
        rerender({ value: 'ab' });
        act(() => vi.advanceTimersByTime(299));
        expect(result.current).toBe('a');
    });

    it('updates to the latest value once the delay has elapsed', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
            initialProps: { value: 'a' },
        });
        rerender({ value: 'ab' });
        act(() => vi.advanceTimersByTime(300));
        expect(result.current).toBe('ab');
    });

    it('resets the timer when the value changes again before it fires', () => {
        const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
            initialProps: { value: 'a' },
        });
        rerender({ value: 'ab' });
        act(() => vi.advanceTimersByTime(200));
        rerender({ value: 'abc' });
        act(() => vi.advanceTimersByTime(200));
        expect(result.current).toBe('a');
        act(() => vi.advanceTimersByTime(100));
        expect(result.current).toBe('abc');
    });
});
