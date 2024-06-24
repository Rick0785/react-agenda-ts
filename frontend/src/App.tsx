import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Calendar from './pages/Calendar';
import { getYearMonthISO } from './utils/date';

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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
