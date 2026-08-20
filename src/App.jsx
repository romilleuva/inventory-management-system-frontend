import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CustomerChat from './pages/CustomerChat';
import StaffLogin from './pages/StaffLogin';
import SalesChat from './pages/SalesChat';
import StockManagement from './pages/StockManagement';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-pp-navy">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<CustomerChat />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route
            path="/staff/sales-chat"
            element={
              <ProtectedRoute>
                <SalesChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/stock"
            element={
              <ProtectedRoute>
                <StockManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
