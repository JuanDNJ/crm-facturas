import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Header from '../components/Header';
import { routesConfig } from './routesConfig';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {routesConfig.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.isProtected ? (
                <ProtectedRoute>
                  <route.component />
                </ProtectedRoute>
              ) : (
                <PublicRoute>
                  <route.component />
                </PublicRoute>
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRouter;