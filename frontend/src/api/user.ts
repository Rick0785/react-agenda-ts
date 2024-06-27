import api from './index';

export interface IUser {
  name: string;
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export const getUser = (): Promise<IUser> =>
  api.get(`/auth/user`).then(resp => resp.data);

export const postSingIn = (login: ILogin): Promise<IUser> =>
  api.post(`/auth/login`, login).then(resp => resp.data);

export const postSingOut = (): Promise<IUser> =>
  api.post(`/auth/logout`).then(resp => resp.data);
