import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../api/user';

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
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  const login = useCallback(
    async (data: IUser) => {
      setUser(data);
      navigate('/');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

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
