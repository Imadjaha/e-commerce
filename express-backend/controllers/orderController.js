import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "cart_items.productId"
    );
    if (!cart || cart.cart_items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total_price = 0;
    const order_items = cart.cart_items.map((item) => {
      total_price += item.productId.price * item.quantity;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });

    const order = await Order.create({
      userId: req.user._id,
      order_items,
      total_price,
    });

    await Cart.findOneAndDelete({ userId: req.user._id }); // Clear the cart after creating the order
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "order_items.productId"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "order_items.productId"
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error getting order" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
};  

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.remove();
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
};