import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Clients from './pages/Clients';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cases" element={<Cases />} />
            <Route path="clients" element={<Clients />} />
            <Route path="documents" element={<div className="p-8 text-center">Página de Documentos em desenvolvimento</div>} />
            <Route path="calendar" element={<div className="p-8 text-center">Página de Agenda em desenvolvimento</div>} />
            <Route path="reports" element={<div className="p-8 text-center">Página de Relatórios em desenvolvimento</div>} />
            <Route path="settings" element={<div className="p-8 text-center">Página de Configurações em desenvolvimento</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
