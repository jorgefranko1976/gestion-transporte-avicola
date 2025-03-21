
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import OwnerList from './pages/OwnerList';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import NewDispatch from './pages/NewDispatch';
import Dispatches from './pages/Dispatches';
import DispatchDetails from './pages/DispatchDetails';
import MonitorVehicles from './pages/MonitorVehicles';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/vehicles" element={
          <ProtectedRoute>
            <Vehicles />
          </ProtectedRoute>
        } />
        
        <Route path="/drivers" element={
          <ProtectedRoute>
            <Drivers />
          </ProtectedRoute>
        } />
        
        <Route path="/owners" element={
          <ProtectedRoute>
            <OwnerList />
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        
        <Route path="/new-dispatch/:orderId?" element={
          <ProtectedRoute>
            <NewDispatch />
          </ProtectedRoute>
        } />

        <Route path="/dispatches" element={
          <ProtectedRoute>
            <Dispatches />
          </ProtectedRoute>
        } />

        <Route path="/dispatch/:id" element={
          <ProtectedRoute>
            <DispatchDetails />
          </ProtectedRoute>
        } />

        <Route path="/monitor" element={
          <ProtectedRoute>
            <MonitorVehicles />
          </ProtectedRoute>
        } />

        <Route path="/settings/*" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
