import React from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { Header } from '../components/layout/Header';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AuthForm mode="login" />
    </div>
  );
};