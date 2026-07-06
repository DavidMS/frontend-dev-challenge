import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({product}) {
    const navigate = useNavigate();

    return (
        <article className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            className="product-card__image"
            />
            <div className="product-card__info">
                <span className="product-card__brand">{product.brand}</span>
                <span className="product-card__model">{product.model}</span>
                <span className="product-card__price">
                    {product.price ? `${product.price} €` : 'Precio no disponible'}
                </span>
            </div>
        </article>
    )
}

export default ProductCard;