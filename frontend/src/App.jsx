import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";

function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute token={token}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute token={token}>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
