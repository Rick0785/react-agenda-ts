import React from 'react';
import { IUser } from '../api/user';

export interface IAuthContext {
  user: IUser;
  onSingOut: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  user: { name: '', email: '' },
  onSingOut: () => {},
});

export const useAuthContext = (): IAuthContext => React.useContext(AuthContext);
