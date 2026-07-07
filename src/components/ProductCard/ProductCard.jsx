import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({product}) {
    return (
        <Link to={`/product/${product.id}`} className="product-card">
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
        </Link>
    )
}

export default ProductCard;
