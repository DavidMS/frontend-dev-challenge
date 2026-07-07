import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts, getProduct, addToCart, ApiError } from './api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const mockProducts = [{ id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: '' }];
const mockProduct = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone',
    options: { colors: [], storages: [] },
};

describe('api', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('getProducts', () => {
        it('fetches from the correct endpoint', async () => {
            fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockProducts),
            });
            const result = await getProducts();
            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/product`, { signal: undefined });
            expect(result).toEqual(mockProducts);
        });

        it('returns cached data on second call without fetching again', async () => {
            fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockProducts),
            });
            await getProducts();
            await getProducts();
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it('throws an ApiError and does not cache when the server responds with an error status', async () => {
            fetch.mockResolvedValue({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ message: 'boom' }),
            });
            await expect(getProducts()).rejects.toThrow(ApiError);

            fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockProducts),
            });
            const result = await getProducts();
            expect(result).toEqual(mockProducts);
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        it('throws an ApiError when the network request fails', async () => {
            fetch.mockRejectedValue(new TypeError('Failed to fetch'));
            await expect(getProducts()).rejects.toThrow(ApiError);
        });
    });

    describe('getProduct', () => {
        it('fetches from the correct endpoint with the id', async () => {
            fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockProduct),
            });
            await getProduct('1');
            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/product/1`, { signal: undefined });
        });

        it('throws an ApiError and does not cache when the product is not found', async () => {
            fetch.mockResolvedValue({
                ok: false,
                status: 404,
                json: () => Promise.resolve({ message: 'not found' }),
            });
            await expect(getProduct('1')).rejects.toThrow(ApiError);

            fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockProduct),
            });
            const result = await getProduct('1');
            expect(result).toEqual(mockProduct);
        });
    });

    describe('addToCart', () => {
        it('posts to the cart endpoint with the correct body', async () => {
            fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ count: 1 }),
            });
            const result = await addToCart({ id: '1', colorCode: 1000, storageCode: 2000 });
            expect(fetch).toHaveBeenCalledWith(
                `${BASE_URL}/api/cart`,
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ id: '1', colorCode: 1000, storageCode: 2000 }),
                })
            );
            expect(result).toEqual({ count: 1 });
        });

        it('throws an ApiError when the server rejects the request', async () => {
            fetch.mockResolvedValue({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ message: 'invalid' }),
            });
            await expect(
                addToCart({ id: '1', colorCode: 1000, storageCode: 2000 })
            ).rejects.toThrow(ApiError);
        });
    });
});
