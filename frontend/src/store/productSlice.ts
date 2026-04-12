import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import type { Product } from '../types';

interface ProductStock {
  [key: number]: number;
}

interface ProductState {
  items: Product[];
  stock: ProductStock;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await api.get('/products');
  return response as unknown as Product[];
});

const initialState: ProductState = {
  items: [],
  stock: {},
  status: 'idle',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    decreaseStock: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      if (state.stock[action.payload.id] !== undefined) {
        state.stock[action.payload.id] = Math.max(
          0,
          state.stock[action.payload.id] - action.payload.quantity
        );
      }
    },
    increaseStock: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      if (state.stock[action.payload.id] !== undefined) {
        state.stock[action.payload.id] += action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        action.payload.forEach((product) => {
          state.stock[product.id] = product.stock;
        });
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      });
  },
});

export const { decreaseStock, increaseStock } = productSlice.actions;
export default productSlice.reducer;
