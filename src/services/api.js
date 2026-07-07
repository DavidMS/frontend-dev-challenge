import { getCache, setCache } from './cache.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
    constructor(message, { status, cause } = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.cause = cause;
    }
}

async function request(url, options) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        throw new ApiError('No se pudo conectar con el servidor', { status: 0, cause: error });
    }

    if (!response.ok) {
        throw new ApiError(`El servidor respondió con un error (${response.status})`, {
            status: response.status,
        });
    }

    if (response.status === 204) return null;

    try {
        return await response.json();
    } catch (error) {
        throw new ApiError('La respuesta del servidor no es válida', {
            status: response.status,
            cause: error,
        });
    }
}

export async function getProducts({ signal } = {}) {
    const cached = getCache('products');
    if (cached) return cached;

    const data = await request(`${BASE_URL}/api/product`, { signal });
    setCache('products', data);
    return data;
}

export async function getProduct(id, { signal } = {}) {
    const cacheKey = `product-${id}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const data = await request(`${BASE_URL}/api/product/${id}`, { signal });
    setCache(cacheKey, data);
    return data;
}

export async function addToCart({ id, colorCode, storageCode }, { signal } = {}) {
    return request(`${BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, colorCode, storageCode }),
        signal,
    });
}
