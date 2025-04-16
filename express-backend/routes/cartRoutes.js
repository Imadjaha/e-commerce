import express from "express";
import {
  addToCart,
  getCart,
  clearCart,
  removeFromCart
} from "../controllers/cartController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getCart);
// router.post("/", authenticateUser, addToCart);
router.post("/", authenticateUser, (req, res, next) => {
  console.log("✅ POST /api/cart Route Reached");
  console.log("📝 Request Headers:", req.headers);
  console.log("📦 Request Body:", req.body);
  next();
}, addToCart);

router.delete("/remove", authenticateUser, removeFromCart);
router.delete("/clear", authenticateUser, clearCart);

export default router;
