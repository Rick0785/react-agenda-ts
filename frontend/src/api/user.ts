import api from './index';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface IUser {
  name: string;
  email: string;
  token?: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export const userQueryKey: string = 'auth/user';

export const getUser = (): Promise<IUser> =>
  api.get(`/auth/user`).then(resp => resp.data);

export const useGetUser = (): UseQueryResult<IUser, Error> => {
  return useQuery<IUser, Error>({
    queryKey: [userQueryKey],
    queryFn: getUser,
  });
};

export const postSingIn = (login: ILogin): Promise<IUser> =>
  api.post(`/auth/login`, login).then(resp => resp.data);

export const postSingOut = (): Promise<IUser> =>
  api.post(`/auth/logout`).then(resp => resp.data);
