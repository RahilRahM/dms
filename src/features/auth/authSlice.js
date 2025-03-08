import { createSlice } from '@reduxjs/toolkit';

// Hardcoded user credentials
const validCredentials = {
  username: 'admin',
  password: 'admin123'
};

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailed: (state, action) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
    }
  }
});

export const { loginSuccess, loginFailed, logout } = authSlice.actions;
export const validateCredentials = (credentials) => {
  return credentials.username === validCredentials.username && 
         credentials.password === validCredentials.password;
};
export default authSlice.reducer;
