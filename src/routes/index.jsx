import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layout/appLayout';
import DashBoard from '../pages/dashboard/DashBoard';
import { PATHS } from '../constants/paths';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <Navigate to={PATHS.DashBoard} replace />,
      },
      {
        path: PATHS.WIDGET_DISPLAY,
        element: <DashBoard />,
      },
    ],
  },
]);
