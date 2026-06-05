'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) return rejectWithValue('No token')
    const { data } = await axios.get('/api/auth/profile/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    return rejectWithValue(e.response?.data)
  }
})

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/login/', creds)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
  } catch (e) {
    return rejectWithValue(e.response?.data || { detail: 'Xatolik' })
  }
})

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/register/', data)
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)
    return res.data
  } catch (e) {
    return rejectWithValue(e.response?.data || { detail: 'Xatolik' })
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { getState }) => {
  try {
    const refresh = localStorage.getItem('refresh_token')
    await axios.post('/api/auth/logout/', { refresh })
  } finally {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, loading: false, initialized: false },
  reducers: {
    setCredentials(state, { payload }) {
      state.user = payload.user
      state.isAuthenticated = true
    },
    clearAuth(state) {
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending,  (s) => { s.loading = true })
      .addCase(fetchProfile.fulfilled, (s, { payload }) => {
        s.user = payload; s.isAuthenticated = true; s.loading = false; s.initialized = true
      })
      .addCase(fetchProfile.rejected, (s) => {
        s.loading = false; s.initialized = true; s.isAuthenticated = false
      })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.user = payload.user; s.isAuthenticated = true
      })
      .addCase(registerUser.pending,   (s) => { s.loading = true })
      .addCase(registerUser.fulfilled, (s, { payload }) => {
        s.user = payload.user; s.isAuthenticated = true; s.loading = false
      })
      .addCase(registerUser.rejected,  (s) => { s.loading = false })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null; s.isAuthenticated = false
      })
  },
})

export const { setCredentials, clearAuth } = authSlice.actions
export default authSlice.reducer
