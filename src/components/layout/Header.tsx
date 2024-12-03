import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="border-b border-teal-100">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-teal-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">FlashcardHero</span>
            </Link>
            <nav className="hidden md:block">
              <Link
                to="/collections"
                className="text-gray-600 hover:text-teal-500 transition-colors"
              >
                Explore
              </Link>
            </nav>
          </div>
          <nav className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {currentUser.displayName || 'User'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
};