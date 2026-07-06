import {createContext, useContext, useState} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(
        () => Number(localStorage.getItem("cartCount")) || 0
    );

    const updateCartCount = (count) => {
        setCartCount(count);
        localStorage.setItem("cartCount", count);
    }

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
            </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext);
}