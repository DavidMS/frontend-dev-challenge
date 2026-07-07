import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { vi, beforeEach, afterEach } from 'vitest'
import ProductListPage from './ProductListPage'
import * as api from '../../services/api'

const mockProducts = [
    { id: '1', brand: 'Apple', model: 'iPhone 15', price: '999', imgUrl: '' },
    { id: '2', brand: 'Samsung', model: 'Galaxy S24', price: '899', imgUrl: '' },
]

function LocationDisplay() {
    const location = useLocation()
    return <div data-testid="location-search">{location.search}</div>
}

function renderPage(initialEntries = ['/']) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/" element={<ProductListPage />} />
            </Routes>
            <LocationDisplay />
        </MemoryRouter>
    )
}

describe('ProductListPage', () => {
    beforeEach(() => {
        vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders products after loading', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument()
            expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
        })
    })

    it('filters by brand after debouncing the input', async () => {
        renderPage()
        await waitFor(() => screen.getByText('iPhone 15'))
        await userEvent.type(screen.getByRole('searchbox'), 'Samsung')
        await waitFor(() => {
            expect(screen.queryByText('iPhone 15')).not.toBeInTheDocument()
            expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
        })
    })

    it('filters by model, ignoring accents and casing', async () => {
        renderPage()
        await waitFor(() => screen.getByText('Galaxy S24'))
        await userEvent.type(screen.getByRole('searchbox'), '  IPHONE  ')
        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument()
            expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument()
        })
    })

    it('shows no products when the search term matches nothing', async () => {
        renderPage()
        await waitFor(() => screen.getByText('iPhone 15'))
        await userEvent.type(screen.getByRole('searchbox'), 'Nokia')
        await waitFor(() => {
            expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
        })
        expect(screen.queryByText('iPhone 15')).not.toBeInTheDocument()
        expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument()
    })

    it('reflects the debounced search term in the URL', async () => {
        renderPage()
        await waitFor(() => screen.getByText('iPhone 15'))
        await userEvent.type(screen.getByRole('searchbox'), 'Samsung')
        await waitFor(() => {
            expect(screen.getByTestId('location-search')).toHaveTextContent('?q=Samsung')
        })
    })

    it('initializes the search term from the URL', async () => {
        renderPage(['/?q=Samsung'])
        await waitFor(() => {
            expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
        })
        expect(screen.getByRole('searchbox')).toHaveValue('Samsung')
        expect(screen.queryByText('iPhone 15')).not.toBeInTheDocument()
    })

    it('shows an error message with a retry option when the products fail to load', async () => {
        vi.spyOn(api, 'getProducts').mockRejectedValueOnce(new Error('network error'))
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('Error al cargar los productos')).toBeInTheDocument()
        })

        await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument()
        })
    })
})
