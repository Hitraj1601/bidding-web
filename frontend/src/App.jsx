import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import ItemsListing from './pages/ItemsListing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import OAuthCallback from './pages/auth/OAuthCallback';
import Dashboard from './pages/Dashboard';
import AuctionDetail from './pages/auctions/AuctionDetail';
import ItemDetail from './pages/items/ItemDetail';
import CreateListing from './pages/items/CreateListing';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import CollectorNetwork from './pages/CollectorNetwork';
import ProvenanceTracker from './pages/ProvenanceTracker';
import TimeCapsuleAuctions from './pages/TimeCapsuleAuctions';
import MysteryBids from './pages/MysteryBids';
import RestorationMarketplace from './pages/RestorationMarketplace';
import AdminPanel from './pages/admin/AdminPanel';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Socket connection
import { initializeSocket } from './utils/socket';

import './App.css';

function App() {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      initializeSocket();
    }
  }, [user]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<ItemsListing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/time-capsule" element={<TimeCapsuleAuctions />} />
            <Route path="/mystery-bids" element={<MysteryBids />} />
            <Route path="/restoration" element={<RestorationMarketplace />} />
            <Route path="/provenance/:itemId" element={<ProvenanceTracker />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/create-listing" element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } />
            <Route path="/collectors" element={
              <ProtectedRoute>
                <CollectorNetwork />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer />

        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
