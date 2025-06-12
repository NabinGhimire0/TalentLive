import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { injectStore as injectAxiosStore } from "../axios";
import { injectStore as injectEchoStore } from "../echo";

const persistConfig = {
  key: "auth",
  storage,
  version: 1,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

injectAxiosStore(store);  // Inject Redux store into axios instance
injectEchoStore(store);   // Inject Redux store into echo instance

export const persistor = persistStore(store);

export default store;
