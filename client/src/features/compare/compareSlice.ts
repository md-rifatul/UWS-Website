import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

const STORAGE_KEY = 'woodtech_compare_items_v1';
const MAX_COMPARE = 4;

const loadPersistedCompare = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistCompare = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist compare items', e);
  }
};

interface CompareState {
  items: Product[];
  notification: string | null;
}

const initialState: CompareState = {
  items: loadPersistedCompare(),
  notification: null,
};

export const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((p) => p.id === action.payload.id);
      if (exists) {
        state.notification = `"${action.payload.name}" is already in comparison.`;
        return;
      }
      if (state.items.length >= MAX_COMPARE) {
        state.notification = `You can compare a maximum of ${MAX_COMPARE} machines simultaneously. Remove one to add another.`;
        return;
      }
      state.items.push(action.payload);
      persistCompare(state.items);
      state.notification = `Added "${action.payload.name}" to comparison matrix.`;
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      persistCompare(state.items);
      state.notification = null;
    },
    clearCompare: (state) => {
      state.items = [];
      persistCompare([]);
      state.notification = null;
    },
    dismissNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare, dismissNotification } =
  compareSlice.actions;

export default compareSlice.reducer;

