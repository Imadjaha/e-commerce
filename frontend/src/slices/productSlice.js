import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchProducts = createAsyncThunk("products/fetchProducts",
    async(_ , {rejectWithValue}) => {
        try {
            const response = await api.get("/api/products")
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const fetchProduct = createAsyncThunk("products/fetchProduct",
    async(productId, {rejectWithValue}) => {
        try {
            const response = await api.get(`/api/products/${productId}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const addProduct = createAsyncThunk("products/addProduct",async(productData, {rejectWithValue}) => {
    try {
        const response = await api.post("/api/products", productData)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const productSlice = createSlice({
    name: "products",
    initialState:{
        items: [],
        selectedProduct: null,
        status:"idle",
        error: null
    },
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.items = action.payload
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })
        .addCase(addProduct.fulfilled, (state, action) => {
            state.items.push(action.payload)
        })
        
        .addCase(addProduct.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })
        .addCase(fetchProduct.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.selectedProduct = action.payload
            state.items = action.payload
        })
        .addCase(fetchProduct.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.payload
        })
        .addCase(fetchProduct.pending, (state) => {
            state.status = "loading"
        })
    }
})

export default productSlice.reducer