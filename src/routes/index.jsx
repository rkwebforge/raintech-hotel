import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layout/appLayout';
import DashBoard from '../pages/dashboard/DashBoard';
import CheckIn from '../pages/check-in/CheckIn';
import CheckOut from '../pages/check-out/CheckOut';
import Booking from '../pages/booking/Booking';
import { PATHS } from '../constants/paths';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <Navigate to={PATHS.DASHBOARD} replace />,
      },
      {
        path: PATHS.DASHBOARD,
        element: <DashBoard />,
      },
      {
        path: PATHS.CHECK_IN,
        element: <CheckIn />,
      },
      {
        path: PATHS.CHECK_OUT,
        element: <CheckOut />,
      },
      {
        path: PATHS.BOOKING,
        element: <Booking />,
      },
    ],
  },
]);
