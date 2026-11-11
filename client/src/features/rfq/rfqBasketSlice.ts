import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, RFQItem } from '@/types';

const STORAGE_KEY = 'woodtech_rfq_basket_v1';

const loadPersistedItems = (): RFQItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistItems = (items: RFQItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist RFQ basket', e);
  }
};

interface RfqBasketState {
  items: RFQItem[];
  isDrawerOpen: boolean;
}

const initialState: RfqBasketState = {
  items: loadPersistedItems(),
  isDrawerOpen: false,
};

export const rfqBasketSlice = createSlice({
  name: 'rfqBasket',
  initialState,
  reducers: {
    addToBasket: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        customRequirements?: string;
        selectedConfigurations?: Record<string, any>;
      }>
    ) => {
      const { product, quantity = 1, customRequirements = '', selectedConfigurations = {} } = action.payload;
      const existing = state.items.find((item) => item.productId === product.id);

      if (existing) {
        existing.quantity += quantity;
        if (customRequirements) existing.customRequirements = customRequirements;
        if (selectedConfigurations) existing.selectedConfigurations = selectedConfigurations;
      } else {
        state.items.push({
          productId: product.id,
          product,
          quantity,
          customRequirements,
          selectedConfigurations,
        });
      }

      persistItems(state.items);
      state.isDrawerOpen = true; // Open drawer to show feedback
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persistItems(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        persistItems(state.items);
      }
    },
    updateRequirements: (state, action: PayloadAction<{ productId: string; notes: string }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.customRequirements = action.payload.notes;
        persistItems(state.items);
      }
    },
    clearBasket: (state) => {
      state.items = [];
      persistItems([]);
    },
    toggleBasketDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setBasketDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const {
  addToBasket,
  removeFromBasket,
  updateQuantity,
  updateRequirements,
  clearBasket,
  toggleBasketDrawer,
  setBasketDrawerOpen,
} = rfqBasketSlice.actions;

export default rfqBasketSlice.reducer;

