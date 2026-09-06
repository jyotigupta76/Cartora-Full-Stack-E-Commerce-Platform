import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SellerOrders from './pages/SellerOrders';
import SellerEarnings from './pages/SellerEarnings';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/seller" element={<SellerDashboard />} />
                        <Route path="/seller/products" element={<SellerProducts />} />
                        <Route path="/seller/products/new" element={<AddProduct />} />
                        <Route path="/seller/products/:id/edit" element={<EditProduct />} />
                        <Route path="/seller/orders" element={<SellerOrders />} />
                        <Route path="/seller/earnings" element={<SellerEarnings />} />

                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
