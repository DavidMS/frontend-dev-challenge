import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {getProducts} from "../../services/api.js";
import {normalizeText} from "../../utils/normalizeText.js";
import {useDebouncedValue} from "../../hooks/useDebouncedValue.js";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import './ProductListPage.css';

function ProductListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') ?? '');
    const [retryCount, setRetryCount] = useState(0);

    const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setLoadingError(false);

        getProducts({ signal: controller.signal })
            .then(setProducts)
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setLoadingError('Error al cargar los productos');
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [retryCount]);

    useEffect(() => {
        const trimmed = debouncedSearchTerm.trim();
        setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }, [debouncedSearchTerm, setSearchParams]);

    const normalizedSearchTerm = normalizeText(debouncedSearchTerm);
    const filteredProducts = products.filter(
        (product) => normalizeText(product.brand).includes(normalizedSearchTerm) ||
            normalizeText(product.model).includes(normalizedSearchTerm)
    )

    if(loading) return <p className="status-message">Cargando productos...</p>
    if(loadingError) return (
        <div className="status-message" role="alert">
            <p>{loadingError}</p>
            <button onClick={() => setRetryCount((count) => count + 1)}>Reintentar</button>
        </div>
    );

    return (
        <div className="product-list-page">
            <div className="product-list-page__toolbar">
                <span>{filteredProducts.length} resultados</span>
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            {filteredProducts.length === 0 ? (
                <p className="status-message">No se encontraron productos</p>
            ) : (
                <div className="product-list-page__grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductListPage;
