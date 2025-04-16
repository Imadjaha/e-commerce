import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, fetchOrders } from "../slices/orderSlice";

function Orders() {
  const dispatch = useDispatch();
  const { orderList, status, error } = useSelector((state) => state.orders);

  useEffect(async() => {
   await dispatch(fetchOrders());
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "failed") {
    return <p>{error}</p>;
  }

  const handlePlaceOrder = () => {
    dispatch(placeOrder())
      .unwrap()
      .then(() => {
        dispatch(fetchOrders()).catch((error) => {
          console.log(error);
        });
      });
  };
  return (
    <div>
      <h2>Orders</h2>
      <button onClick={handlePlaceOrder}>Place Order</button>
      {status === "loading" && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* <ul>
        {orderList.map((order) => (
          <li key={order.orderId}>
            Order #{order.orderId}, Total: {order.totalPrice}, Status:{" "}
            {order.status}
            <ul>
              {order.items.map((i) => (
                <li key={i.productId}>
                  Product ID: {i.productId} / {i.productName} (Qty: {i.quantity}
                  ) - ${i.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>  */}
    </div>
  );
}

export default Orders;
