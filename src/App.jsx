import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header/Header.jsx';
import ProductListPage from './pages/ProductListPage/ProductListPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<ProductListPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                    </Routes>
                </main>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;
