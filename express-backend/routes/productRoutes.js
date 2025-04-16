import express from "express";
import { getAllProducts, addNewProduct, getSingleProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", authenticateUser, addNewProduct);
router.get("/:id", getSingleProduct);
router.put("/:id", authenticateUser, updateProduct);
router.delete("/:id", authenticateUser, deleteProduct);

export default router;