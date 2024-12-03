import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { PublicRoute } from './components/routes/PublicRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { CreateCollection } from './pages/CreateCollection';
import { Practice } from './pages/Practice';
import { Collections } from './pages/Collections';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route
            path="/login"
            element={
              <PublicRoute fallback="/dashboard">
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute fallback="/dashboard">
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/collections/create"
            element={
              <PrivateRoute>
                <CreateCollection />
              </PrivateRoute>
            }
          />
          <Route path="/collections/:id/practice" element={<Practice />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;