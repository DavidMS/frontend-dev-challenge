function SearchBar({ value, onChange }) {
    return (
        <div>
            <label htmlFor="product-search" className="sr-only">
                Buscar por marca o modelo
            </label>
            <input
                id="product-search"
                type="search"
                placeholder="Buscar por marca o modelo..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;
