import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/orders/place");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});


export default orderSlice.reducer