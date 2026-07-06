import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

const product = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15',
    price: '999',
    imgUrl: 'https://example.com/img.jpg',
}

describe('ProductCard', () => {
    it('renders brand, model and price', () => {
        render(
            <MemoryRouter>
                <ProductCard product={product} />
            </MemoryRouter>
        )
        expect(screen.getByText('Apple')).toBeInTheDocument()
        expect(screen.getByText('iPhone 15')).toBeInTheDocument()
        expect(screen.getByText('999 €')).toBeInTheDocument()
    })

    it('shows "Precio no disponible" when price is empty', () => {
        render(
            <MemoryRouter>
                <ProductCard product={{ ...product, price: '' }} />
            </MemoryRouter>
        )
        expect(screen.getByText('Precio no disponible')).toBeInTheDocument()
    })
})