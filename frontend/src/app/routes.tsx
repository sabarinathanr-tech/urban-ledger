import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignupPage } from '@/features/auth/pages/SignupPage';
import { CreateUserPage } from '@/features/auth/pages/CreateUserPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Authentication and User Entry Routes wrapped in unified AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
      </Route>

      {/* Root and Catch-All: Redirect to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
