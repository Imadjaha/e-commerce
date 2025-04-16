import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

// Async Thunk: User Registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Async Thunk: User Login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/auth/login', credentials)
    const { token } = response.data
      ? response.data
      : { token: response.data } // Some backends might directly return string
    localStorage.setItem('token', token)
    return token
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      localStorage.removeItem('token')
      
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Registration failed'
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Login failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
