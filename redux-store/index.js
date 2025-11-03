// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './slices/CreateInvoiceSlice';

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;