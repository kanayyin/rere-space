import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './features/cart/CartContext.jsx';
import { ConfigProvider } from './features/config/ConfigContext.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import LandingPage from './features/landing/LandingPage.jsx';
import ProductDetailPage from './features/landing/ProductDetailPage.jsx';
import CartPage from './features/cart/CartPage.jsx';
import CheckoutPage from './features/checkout/CheckoutPage.jsx';
import OrderSuccessPage from './features/checkout/OrderSuccessPage.jsx';
import AdminLogin from './features/admin/AdminLogin.jsx';
import AdminLayout from './features/admin/AdminLayout.jsx';
import DashboardPage from './features/admin/dashboard/DashboardPage.jsx';
import AdminProductsPage from './features/admin/products/AdminProductsPage.jsx';
import AdminProductFormPage from './features/admin/products/AdminProductFormPage.jsx';
import AdminOrdersPage from './features/admin/orders/AdminOrdersPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfigProvider>
          <CartProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/produk/:slug" element={<ProductDetailPage />} />
              <Route path="/keranjang" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pesanan/:orderCode" element={<OrderSuccessPage />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="produk" element={<AdminProductsPage />} />
                <Route path="produk/baru" element={<AdminProductFormPage />} />
                <Route path="produk/:id" element={<AdminProductFormPage />} />
                <Route path="pesanan" element={<AdminOrdersPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </ConfigProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
