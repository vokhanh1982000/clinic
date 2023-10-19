import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { axiosInstance } from '../apis';
import { Administrator, AdministratorClinic, Customer, DoctorClinic, LoginResponseDto } from '../apis/client-axios';

export interface AuthState {
  loading: boolean;
  error: string;
  userType?: 'administrator' | 'customer';
  authUser?: Administrator | Customer | AdministratorClinic | DoctorClinic;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: (): AuthState => {
    let initState: AuthState = {
      loading: false,
      error: '',
    };

    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      initState.authUser = JSON.parse(authUser);
    }

    return initState;
  },
  reducers: {
    login: (state, action: PayloadAction<LoginResponseDto>) => {
      localStorage.setItem('authUser', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.token);
      axiosInstance.defaults.headers.Authorization = action.payload.token ? `Bearer ${action.payload.token}` : '';
    },
    updateMe: (state, action: PayloadAction<Customer | Administrator | AdministratorClinic>) => {
      state.authUser = action.payload;
    },
    logout: (state) => {
      state.authUser = undefined;
      localStorage.removeItem('token');
    },
  },
});

export const { logout, login, updateMe } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const getMe = (state: AuthState) => state.authUser;
export default authSlice.reducer;
