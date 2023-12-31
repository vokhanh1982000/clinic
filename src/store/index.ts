import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import settingReducer from './settingSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import clinicReducer from './clinicSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer,
    clinic: clinicReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
