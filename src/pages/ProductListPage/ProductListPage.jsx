import {useEffect, useState} from "react";
import {getProducts} from "../../services/api.js";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import './ProductListPage.css';

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const controller = new AbortController();

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
    }, []);

    const filteredProducts = products.filter(
        (product) => product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.model.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if(loading) return <p className="status-message">Cargando productos...</p>
    if(loadingError) return <p className="status-message">{loadingError}</p>;

    return (
        <div className="product-list-page">
            <div className="product-list-page__toolbar">
                <span>{filteredProducts.length} resultados</span>
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="product-list-page__grid">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default ProductListPage;