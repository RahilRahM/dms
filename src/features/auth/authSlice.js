import { createSlice } from '@reduxjs/toolkit';

const validUsers = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage_users'] 
  },
  { 
    id: 2, 
    username: 'user', 
    password: 'user123', 
    role: 'normal',
    permissions: ['read', 'create'] // Changed permissions for normal users
  }
];

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
    },
    createUser: (state, action) => {
      validUsers.push(action.payload);
    }
  }
});

export const { loginSuccess, loginFailed, logout, createUser } = authSlice.actions;
export const validateCredentials = (credentials) => {
  const user = validUsers.find(u => 
    u.username === credentials.username && 
    u.password === credentials.password
  );
  return user || null;
};

export const hasPermission = (state, permission) => {
  return state.auth.user?.permissions?.includes(permission) || false;
};

export default authSlice.reducer;
