import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';

function AppLayout() {
  return (
    <div className="bg-canvas min-h-screen">
      <Navbar propertyName="Raintech" propertyType="Hotel" />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
