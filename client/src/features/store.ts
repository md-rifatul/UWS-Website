import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import rfqBasketReducer from './rfq/rfqBasketSlice';
import compareReducer from './compare/compareSlice';
import catalogReducer from './catalog/catalogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rfqBasket: rfqBasketReducer,
    compare: compareReducer,
    catalog: catalogReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
