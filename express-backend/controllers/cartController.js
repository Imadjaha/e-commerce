import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "cart_items.productId"
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error getting cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    
    if (!req.user || !req.user._id ) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
   
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, cart_items: [] });
    }

    const productExists = cart.cart_items.find(
      (item) => item.productId.toString() === productId
    );

    if (productExists) {
      productExists.quantity += quantity || 1;
    } else {
      cart.cart_items.push({ productId, quantity });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" , error: error.message});
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const {productId} = req.body;
    let cart = await Cart.findOne({userId: req.user._id});
    if(!cart){
        return res.status(404).json({message:"Cart not found"});
    }
    cart.cart_items = cart.cart_items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};
