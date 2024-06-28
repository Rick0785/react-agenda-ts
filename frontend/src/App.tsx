import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { getUser, IUser } from './api/user';
import { AuthContext } from './contexts/AuthContext';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import { getYearMonthISO } from './utils/date';

function App() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUser().then(setUser, () => setUser(null));
  }, []);

  const onSingOut = () => {
    setUser(null);
  };

  const router = createBrowserRouter([
    {
      path: '/calendar/:month',
      element: <Calendar />,
    },
    {
      path: '*',
      element: <Navigate to={`/calendar/${getYearMonthISO()}`} />,
    },
  ]);

  return user ? (
    <AuthContext.Provider value={{ user, onSingOut }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  ) : (
    <Login onSignIn={setUser} />
  );
}

export default App;
