import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../api/user';
import { Storages } from '../constantes';
import { useLocalStorage } from './useLocalStorage';

export interface IAuthContext {
  user: IUser | null;
  login: (data: IUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  login: () => {},
  logout: () => {},
});

export interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useLocalStorage<IUser | null>(Storages.USER, null);
  const navigate = useNavigate();

  const login = useCallback(
    async (data: IUser) => {
      setUser(data);
      navigate('/');
    },
    [navigate, setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate, setUser]);

  const value = useMemo<IAuthContext>(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): IAuthContext => useContext(AuthContext);
