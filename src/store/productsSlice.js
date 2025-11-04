"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (opts = {}, thunkAPI) => {
    try {
      // opts ignored for pagination-free API; we may accept opts.limit in the future
      const url = `/api/products`;
      const res = await fetch(url);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to fetch products");
      // return full payload so reducer can decide append vs replace
      return payload || { products: [] };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch products");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null, meta: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // payload is { products, meta } from the API
        const payload = action.payload || {};
        const fetched = Array.isArray(payload.products) ? payload.products : [];
        // Always replace the client store with API response (no pagination append)
        state.items = fetched;
        state.meta = payload.meta || state.meta || { total: fetched.length };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch";
      });
  },
});

export default productsSlice.reducer;
