import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../slices/cartSlice";
import CartItem from "../components/CartItem";
import { addProduct, fetchProducts } from "../slices/productSlice";

function Cart() {
  const dispatch = useDispatch();
  const { cartItems, status, error } = useSelector((state) => state.cart);

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getCart());
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "failed") {
    return <p>{error}</p>;
  }

  const handleQualityIncrease = async (productId) => {
    await dispatch(increaseQuantity(productId));
    dispatch(getCart());
  };

  const handleQualityDecrease = async (productId) => {
    if (
      cartItems.find((item) => item.productId._id === productId).quantity > 1
    ) {
      await dispatch(decreaseQuantity(productId));
    } else {
      await dispatch(removeFromCart(productId));
    }
    dispatch(getCart());
  };

  const handleDeleteProductFromCart = async (productId) => {
    await dispatch(removeFromCart(productId));
    dispatch(getCart());
  };

  const handleClearCart = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to clear the cart?"
    );

    if (isConfirmed) {
      await dispatch(clearCart());
      dispatch(getCart());
    }
  };

  const total = cartItems?.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onIncrease={() => handleQualityIncrease(item.productId._id)}
              onDecrease={() => handleQualityDecrease(item.productId._id)}
              onDelete={() => handleDeleteProductFromCart(item.productId._id)}
            />
          ))}
          <div className="text-right mt-6 text-lg font-semibold">
            Subtotal ({cartItems.length} items): ${total.toFixed(2)}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
