import { IUser } from '../api/user';
import { Storages } from '../constantes';

export function getStoredUser(): IUser | null {
  const storedUser = localStorage.getItem(Storages.USER);
  if (storedUser) {
    return JSON.parse(storedUser) as IUser;
  }
  return null;
}
