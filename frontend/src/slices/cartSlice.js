import { createSlice, createAsyncThunk, asyncThunkCreator } from "@reduxjs/toolkit";
import api from "../api/axios";
import { easeOut } from "framer-motion";

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart", { productId, quantity });
      return response.data;
    } catch (error) {
      console.log("add to cart error", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete("/api/cart/remove", {
        data: { productId }, // Sending the productId in the request body
      });
    } catch (error) {
      console.log("remove from cart error", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart", { productId, quantity: 1 });
      return response.data;
    } catch (error) {
      console.log("increase quantity error", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
    'cart/decreaseQuantity',
    async(productId,{rejectWithValue})=>{
        try{
            const response = await api.post("/api/cart", {productId,quantity:-1});
            return response.data;
        }
        catch(error){
            console.log("decrease quantity error",error);
            return rejectWithValue(error.response.data)
        }
    }
)

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/api/cart/clear");
      return response.data;
    } catch (error) {
      console.log("clear cart error", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.cartItems = [];
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload?.cart_items || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems.push(action.payload);
        state.status = "succeeded";
        state.error = null;
        
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
      })
      
  },
});

export default cartSlice.reducer;
