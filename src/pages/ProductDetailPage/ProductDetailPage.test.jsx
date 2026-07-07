import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import ProductDetailPage from './ProductDetailPage';
import { CartProvider } from '../../context/CartContext';
import * as api from '../../services/api';

const mockProduct = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15',
    price: '999',
    imgUrl: '',
    cpu: 'A16',
    ram: '6GB',
    os: 'iOS',
    displaySize: '6.1"',
    battery: '3349mAh',
    primaryCamera: ['48MP'],
    secondaryCmera: ['12MP'],
    dimentions: '147x71x7.8mm',
    weight: '171',
    options: {
        colors: [
            { code: 1000, name: 'Negro' },
            { code: 1001, name: 'Blanco' },
        ],
        storages: [
            { code: 2000, name: '128GB' },
            { code: 2001, name: '256GB' },
        ],
    },
};

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/product/1']}>
            <CartProvider>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>
            </CartProvider>
        </MemoryRouter>
    );
}

describe('ProductDetailPage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(api, 'getProduct').mockResolvedValue(mockProduct);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the product details after loading', async () => {
        renderPage();
        expect(screen.getByText('Cargando producto...')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Apple iPhone 15' })).toBeInTheDocument();
        });
        expect(screen.getByText('999 €')).toBeInTheDocument();
    });

    it('shows an error message when the product fails to load', async () => {
        vi.spyOn(api, 'getProduct').mockRejectedValue(new Error('network error'));
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('Error al cargar el producto')).toBeInTheDocument();
        });
    });

    it('retries loading the product when the retry button is clicked', async () => {
        vi.spyOn(api, 'getProduct').mockRejectedValueOnce(new Error('network error'));
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('Error al cargar el producto')).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Apple iPhone 15' })).toBeInTheDocument();
        });
    });

    it('lets the user change the selected color and storage', async () => {
        renderPage();
        await screen.findByRole('heading', { name: 'Apple iPhone 15' });

        await userEvent.selectOptions(screen.getByLabelText('Color'), 'Blanco');
        expect(screen.getByLabelText('Color')).toHaveValue('1001');

        await userEvent.selectOptions(screen.getByLabelText('Almacenamiento'), '256GB');
        expect(screen.getByLabelText('Almacenamiento')).toHaveValue('2001');
    });

    it('adds the product to the cart and updates the cart count', async () => {
        vi.spyOn(api, 'addToCart').mockResolvedValue({ count: 1 });
        renderPage();
        await screen.findByRole('heading', { name: 'Apple iPhone 15' });

        await userEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));

        await waitFor(() => {
            expect(api.addToCart).toHaveBeenCalledWith({
                id: '1',
                colorCode: 1000,
                storageCode: 2000,
            });
        });
        expect(localStorage.getItem('cartCount')).toBe('1');
        await waitFor(() => {
            expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();
        });
    });

    it('shows an error message when adding to the cart fails', async () => {
        vi.spyOn(api, 'addToCart').mockRejectedValue(new Error('server error'));
        renderPage();
        await screen.findByRole('heading', { name: 'Apple iPhone 15' });

        await userEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));

        await waitFor(() => {
            expect(
                screen.getByText('No se pudo añadir el producto al carrito')
            ).toBeInTheDocument();
        });
    });
});
