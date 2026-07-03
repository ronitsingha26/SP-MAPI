import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
  // Public site is now accessible to everyone — logged-in users see "Dashboard" button in navbar
  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
