import { createSlice } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../types';
import type {  PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: CartItem[];
}

// Khôi phục giỏ hàng từ localStorage khi khởi động
const loadState = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return { items: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { items: [] };
  }
};

// Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
const saveState = (items: CartItem[]) => {
  try {
    const serializedState = JSON.stringify({ items });
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    console.error('Could not save cart to local storage', err);
  }
};

const initialState: CartState = loadState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product & { addQuantity?: number }>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const quantityToAdd = action.payload.addQuantity || 1;

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        const { addQuantity, ...product } = action.payload;
        state.items.push({ ...product, quantity: quantityToAdd });
      }
      saveState(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveState(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      saveState(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state.items);
    },
    clearPurchasedItems: (state, action: PayloadAction<number[]>) => {
      state.items = state.items.filter(item => !action.payload.includes(item.id));
      saveState(state.items);
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, clearPurchasedItems } = cartSlice.actions;
export default cartSlice.reducer;