import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Subcategories from './pages/Subcategories';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SelectStore from './pages/SelectStore';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/subs" element={<Subcategories />} />
        <Route path="/products/:id" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/map" element={<SelectStore />} />
        <Route path="/check" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}
