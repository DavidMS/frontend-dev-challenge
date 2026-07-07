import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach } from 'vitest'
import { CartProvider, useCart } from './CartContext'

function CartConsumer() {
    const { cartCount, updateCartCount } = useCart()
    return (
        <div>
            <span>Count: {cartCount}</span>
            <button onClick={() => updateCartCount(cartCount + 1)}>Add</button>
        </div>
    )
}

describe('CartContext', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('defaults to 0 when there is nothing in localStorage', () => {
        render(<CartProvider><CartConsumer /></CartProvider>)
        expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })

    it('initializes from the value already stored in localStorage', () => {
        localStorage.setItem('cartCount', '3')
        render(<CartProvider><CartConsumer /></CartProvider>)
        expect(screen.getByText('Count: 3')).toBeInTheDocument()
    })

    it('updates the count and persists it to localStorage', async () => {
        render(<CartProvider><CartConsumer /></CartProvider>)
        await userEvent.click(screen.getByRole('button', { name: 'Add' }))
        expect(screen.getByText('Count: 1')).toBeInTheDocument()
        expect(localStorage.getItem('cartCount')).toBe('1')
    })
})
