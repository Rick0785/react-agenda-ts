import { Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { IUser } from '../../api/user';

const ProtectedRoute = () => {
  const user = useLoaderData() as IUser | null;
  return user ? <Outlet /> : <Navigate to={`/login`} />;
};

export default ProtectedRoute;
