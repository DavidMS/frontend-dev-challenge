import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getProducts, getProduct, addToCart } from './api'

const mockProducts = [{ id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: '' }]
const mockProduct = { id: '1', brand: 'Apple', model: 'iPhone', options: { colors: [], storages: [] } }

describe('api', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe('getProducts', () => {
        it('fetches from the correct endpoint', async () => {
            fetch.mockResolvedValue({ json: () => Promise.resolve(mockProducts) })
            const result = await getProducts()
            expect(fetch).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product')
            expect(result).toEqual(mockProducts)
        })

        it('returns cached data on second call without fetching again', async () => {
            fetch.mockResolvedValue({ json: () => Promise.resolve(mockProducts) })
            await getProducts()
            await getProducts()
            expect(fetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('getProduct', () => {
        it('fetches from the correct endpoint with the id', async () => {
            fetch.mockResolvedValue({ json: () => Promise.resolve(mockProduct) })
            await getProduct('1')
            expect(fetch).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product/1')
        })
    })

    describe('addToCart', () => {
        it('posts to the cart endpoint with the correct body', async () => {
            fetch.mockResolvedValue({ json: () => Promise.resolve({ count: 1 }) })
            const result = await addToCart({ id: '1', colorCode: 1000, storageCode: 2000 })
            expect(fetch).toHaveBeenCalledWith(
                'https://itx-frontend-test.onrender.com/api/cart',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ id: '1', colorCode: 1000, storageCode: 2000 }),
                })
            )
            expect(result).toEqual({ count: 1 })
        })
    })
})