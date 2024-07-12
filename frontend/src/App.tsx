import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  useOutlet,
} from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import { getYearMonthISO } from './utils/date';
import { loader as protectedLoader } from './routes/protected/actions';
import ProtectedRoute from './routes/protected';

const AuthLayout = () => {
  const outlet = useOutlet();
  return <AuthProvider>{outlet}</AuthProvider>;
};

const router = createHashRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route loader={protectedLoader} element={<ProtectedRoute />}>
        <Route path="/calendar/:month" element={<Calendar />} />
        <Route
          path="*"
          element={<Navigate to={`/calendar/${getYearMonthISO()}`} />}
        />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
