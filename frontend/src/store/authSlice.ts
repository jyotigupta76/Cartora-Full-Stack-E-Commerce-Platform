import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '../types/auth.types';

interface AuthState {
    token: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            const { token, name, email, role } = action.payload;
            state.token = token;
            state.name = name;
            state.email = email;
            state.role = role;
            state.isAuthenticated = true;

            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
        },
        logout: (state) => {
            state.token = null;
            state.name = null;
            state.email = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.clear();
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;