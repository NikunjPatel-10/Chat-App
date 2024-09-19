import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../pages/home/utility/services/user.service";
import { authApi } from "../core/utility/services/auth-service";
import { userReducer } from "../features/UserSlice";

export const store = configureStore({
    reducer: {
     [userApi.reducerPath]:userApi.reducer,
     [authApi.reducerPath]:authApi.reducer,
     user:userReducer
    },
  
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(
        {
          serializableCheck: false
        }
      ).concat([
        userApi.middleware,
        authApi.middleware
      ]),
  });

type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;