import {getCache, setCache} from "./cache.js";

const BASE_URL = 'https://itx-frontend-test.onrender.com'

export async function getProducts() {
    const cached = getCache('products');
    if(cached) return cached;

    const response = await fetch(`${BASE_URL}/api/product`);
    const data = await response.json();
    setCache('products', data);
    return data;
}

export async function getProduct(id) {
    const cacheKey = `product-${id}`;
    const cached = getCache(cacheKey);
    if(cached) return cached;

    const response = await fetch(`${BASE_URL}/api/product/${id}`);
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
}

export async function addToCart({id, colorCode, storageCode}) {
    const response = await fetch(`${BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id, colorCode, storageCode}),
    })
    return response.json();
}