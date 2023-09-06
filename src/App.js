import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import axiosClient from "libraries/axiosClient";
import { LOCATIONS } from "constants";

import Login from "./pages/login";
import CategoryPage from "./pages/Categories";
import ProductList from "./pages/product";
import ProductDetail from "./pages/product/ProductDetail";
import SupplierPage from "./pages/suppliers";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("TOKEN");
  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      navigate(LOCATIONS.LOGIN);
    }
  }, [navigate, token]);

  return !token ? (
    <Routes>
      <Route path="login" element={<Login />} />
    </Routes>
  ) : (
    <Routes>
      <Route index element={<ProductList />} />
      <Route path="products" element={<ProductList />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="categories" element={<CategoryPage />} />
      <Route path="suppliers" element={<SupplierPage />} />
    </Routes>
  );

  // {/* <Route path="/" element={<Layout />}> */}
  // {/* <Route path="*" element={<NoPage />} /> */}
  // {/* </Route> */}
}

export default App;
