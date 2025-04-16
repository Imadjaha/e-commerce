import express from "express";
import {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder
} from "../controllers/orderController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getAllOrders);
router.get("/:id", authenticateUser, getSingleOrder);
router.post("/", authenticateUser, createOrder);
router.put("/:id", authenticateUser, updateOrder);
router.delete("/:id", authenticateUser, deleteOrder);

export default router;