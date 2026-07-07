import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
    it('renders a search input', () => {
        render(<SearchBar value="" onChange={() => {}} />)
        expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    it('calls onChange when the user types', async () => {
        const onChange = vi.fn()
        render(<SearchBar value="" onChange={onChange} />)
        await userEvent.type(screen.getByRole('searchbox'), 'apple')
        expect(onChange).toHaveBeenCalled()
    })

    it('has an accessible label for screen readers', () => {
        render(<SearchBar value="" onChange={() => {}} />)
        expect(screen.getByLabelText('Buscar por marca o modelo')).toBeInTheDocument()
    })
})
