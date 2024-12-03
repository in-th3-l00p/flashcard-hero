import React from 'react';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/home/Hero';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
    </div>
  );
};