import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logout as logoutAction } from '../store/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    const logout = () => {
        dispatch(logoutAction());
    };

    return { ...auth, logout };
};