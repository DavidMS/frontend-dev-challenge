import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./Header.css";

function Header() {
    const { cartCount } = useCart();
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className="header">
            <Link to="/" className="header__logo">Mobile Shop</Link>
            <nav className="header__breadcrumb">
                {isHome ? (
                    <span>Inicio</span>
                ) : (
                    <span>
                        <Link to="/">Inicio</Link> / Detalle
                    </span>
                )}
            </nav>
            <div className="header__cart">
                <span>Carrito</span>
                <span className="header__cart-badge">{cartCount}</span>
            </div>
        </header>
    )
}

export default Header;