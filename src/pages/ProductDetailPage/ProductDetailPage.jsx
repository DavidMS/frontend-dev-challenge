import './ProductDetailPage.css';
import {useParams, Link} from "react-router-dom";
import {useCart} from "../../context/CartContext.jsx";
import {useEffect, useState} from "react";
import {addToCart, getProduct} from "../../services/api.js";

function ProductDetailPage() {
    const { id } = useParams();
    const { cartCount, updateCartCount } = useCart();

    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState(null);
    const [addSuccess, setAddSuccess] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        getProduct(id, { signal: controller.signal })
            .then((data) => {
                setProduct(data);
                setSelectedColor(data.options.colors[0]?.code ?? null);
                setSelectedStorage(data.options.storages[0]?.code ?? null);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError('Error al cargar el producto');
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            })

        return () => controller.abort();
    }, [id, retryCount])

    const handleAddToCart = () => {
        setAdding(true);
        setAddError(null);
        setAddSuccess(false);
        addToCart({ id, colorCode: selectedColor, storageCode: selectedStorage })
            .then(() => {
                updateCartCount(cartCount + 1);
                setAddSuccess(true);
            })
            .catch(() => setAddError('No se pudo añadir el producto al carrito'))
            .finally(() => setAdding(false))
    }

    if (loading) return <p className="status-message">Cargando producto...</p>
    if (error) return (
        <div className="status-message" role="alert">
            <p>{error}</p>
            <button onClick={() => setRetryCount((count) => count + 1)}>Reintentar</button>
        </div>
    );

    return (
        <div className="product-detail-page">
            <Link to="/" className="back-link">← Volver al listado</Link>

            <div className="product-detail-page__content">
                <div className="product-detail-page__image">
                    <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} />
                </div>

                <div>
                    <div className="description">
                        <h1>{product.brand} {product.model}</h1>
                        <dl>
                            <dt>Precio</dt>
                            <dd>{product.price ? `${product.price} €` : 'No disponible'}</dd>
                            <dt>CPU</dt>
                            <dd>{product.cpu}</dd>
                            <dt>RAM</dt>
                            <dd>{product.ram}</dd>
                            <dt>Sistema Operativo</dt>
                            <dd>{product.os}</dd>
                            <dt>Resolución de pantalla</dt>
                            <dd>{product.displaySize}</dd>
                            <dt>Batería</dt>
                            <dd>{product.battery}</dd>
                            <dt>Cámara principal</dt>
                            <dd>{[].concat(product.primaryCamera).join(', ')}</dd>
                            <dt>Cámara secundaria</dt>
                            <dd>{[].concat(product.secondaryCmera).join(', ')}</dd>
                            <dt>Dimensiones</dt>
                            <dd>{product.dimentions}</dd>
                            <dt>Peso</dt>
                            <dd>{product.weight ? `${product.weight} g` : 'No disponible'}</dd>
                        </dl>
                    </div>

                    <div className="actions">
                        <div className="actions__selectors">
                            <div>
                                <label htmlFor="color-select">Color</label>
                                <select
                                id="color-select"
                                value={selectedColor ?? ''}
                                onChange={(e) => setSelectedColor(Number(e.target.value))}
                                >
                                    {product.options.colors.map((color) => (
                                        <option key={color.code} value={color.code}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="storage-select">Almacenamiento</label>
                                <select
                                id="storage-select"
                                value={selectedStorage ?? ''}
                                onChange={(e) => setSelectedStorage(e.target.value)}>
                                    {product.options.storages.map((storage) => (
                                        <option key={storage.code} value={storage.code}>
                                            {storage.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                        className="actions__add-button"
                        onClick={handleAddToCart}
                        disabled={adding || !selectedColor || !selectedStorage}
                        >
                            {adding ? 'Añadiendo...' : 'Añadir al carrito'}
                        </button>
                        {addError && <p className="status-message" role="alert">{addError}</p>}
                        {addSuccess && (
                            <p className="status-message status-message--success" role="status">
                                Producto añadido al carrito
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProductDetailPage;