import { getUser, IUser } from '../../api/user';
export const loader = async (): Promise<IUser | null> => {
  try {
    var user = await getUser();
    return user;
  } catch (error) {
    return null;
  }
};
