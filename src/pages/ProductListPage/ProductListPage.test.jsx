import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, beforeEach, afterEach } from 'vitest'
import ProductListPage from './ProductListPage'
import * as api from '../../services/api'

const mockProducts = [
    { id: '1', brand: 'Apple', model: 'iPhone 15', price: '999', imgUrl: '' },
    { id: '2', brand: 'Samsung', model: 'Galaxy S24', price: '899', imgUrl: '' },
]

describe('ProductListPage', () => {
    beforeEach(() => {
        vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders products after loading', async () => {
        render(<MemoryRouter><ProductListPage /></MemoryRouter>)
        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument()
            expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
        })
    })

    it('filters by brand', async () => {
        render(<MemoryRouter><ProductListPage /></MemoryRouter>)
        await waitFor(() => screen.getByText('iPhone 15'))
        await userEvent.type(screen.getByRole('searchbox'), 'Samsung')
        expect(screen.queryByText('iPhone 15')).not.toBeInTheDocument()
        expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
    })

    it('filters by model', async () => {
        render(<MemoryRouter><ProductListPage /></MemoryRouter>)
        await waitFor(() => screen.getByText('Galaxy S24'))
        await userEvent.type(screen.getByRole('searchbox'), 'iPhone')
        expect(screen.getByText('iPhone 15')).toBeInTheDocument()
        expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument()
    })

    it('shows no products when the search term matches nothing', async () => {
        render(<MemoryRouter><ProductListPage /></MemoryRouter>)
        await waitFor(() => screen.getByText('iPhone 15'))
        await userEvent.type(screen.getByRole('searchbox'), 'Nokia')
        expect(screen.queryByText('iPhone 15')).not.toBeInTheDocument()
        expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument()
    })

    it('shows an error message when the products fail to load', async () => {
        vi.spyOn(api, 'getProducts').mockRejectedValue(new Error('network error'))
        render(<MemoryRouter><ProductListPage /></MemoryRouter>)
        await waitFor(() => {
            expect(screen.getByText('Error al cargar los productos')).toBeInTheDocument()
        })
    })
})