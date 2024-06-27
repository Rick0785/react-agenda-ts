import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { getUser, IUser } from './api/user';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import { getYearMonthISO } from './utils/date';

function App() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUser().then(setUser, () => setUser(null));
  }, []);

  const singOut = () => {
    setUser(null);
  };

  const router = createBrowserRouter([
    {
      path: '/calendar/:month',
      element: <Calendar user={user!} onSingOut={singOut} />,
    },
    {
      path: '*',
      element: <Navigate to={`/calendar/${getYearMonthISO()}`} />,
    },
  ]);

  return user ? (
    <RouterProvider router={router} />
  ) : (
    <Login onSignIn={setUser} />
  );
}

export default App;
