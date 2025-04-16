
import dotenv from "dotenv";

dotenv.config();  // this should be before any other imports

import express from "express";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";


const PORT = process.env.PORT || 3000

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/cart',cartRoutes);
app.use('/images',express.static('public/images'));

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})