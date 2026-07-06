import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {getCache, setCache} from "./cache.js";

describe('cache', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns null for a missing key', () => {
        expect(getCache('missing')).toBeNull()
    })

    it('returns stored data before expiry', () => {
        setCache('key', { foo: 'bar' })
        expect(getCache('key')).toEqual({foo: 'bar'})
    })

    it('returns null and clears item after expiry', () => {
        setCache('key', { foo: 'bar' })
        vi.advanceTimersByTime(60 * 60 * 1000 + 1)
        expect(getCache('key')).toBeNull()
        expect(localStorage.getItem('key')).toBeNull()
    })
})