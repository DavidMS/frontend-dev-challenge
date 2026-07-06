function SearchBar({value, onChange}) {
    return (
        <input
            type="search"
            placeholder="Buscar por marca o modelo..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            />
    )
}

export default SearchBar;