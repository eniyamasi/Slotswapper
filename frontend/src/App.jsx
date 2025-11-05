import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import EventList from './components/Calendar/EventList';
import SwappableSlots from './components/Marketplace/SwappableSlots';
import SwapRequests from './components/Notifications/SwapRequests';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav style={{
        padding: '20px 40px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '0 0 20px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            📅 SlotSwapper
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#666', fontWeight: '500' }}>Welcome, {user?.name}! 👋</span>
            <Link to="/dashboard" style={{
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#667eea',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            >📆 Calendar</Link>
            <Link to="/marketplace" style={{
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#667eea',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            >🛒 Marketplace</Link>
            <Link to="/requests" style={{
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#667eea',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            >🔔 Requests</Link>
            <button onClick={logout} style={{ padding: '8px 16px' }}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="container">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <EventList />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <PrivateRoute>
                <Layout>
                  <SwappableSlots />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <Layout>
                  <SwapRequests />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

