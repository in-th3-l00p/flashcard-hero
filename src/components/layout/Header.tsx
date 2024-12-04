import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="relative border-b border-teal-100 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-teal-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">FlashcardHero</span>
            </Link>
            <nav className="ml-8 hidden md:block">
              <Link
                to="/collections"
                className="text-gray-600 transition-colors hover:text-teal-500"
              >
                Explore
              </Link>
            </nav>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-4 md:flex">
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

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-teal-100 bg-white p-4 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/collections"
              className="text-gray-600 transition-colors hover:text-teal-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {currentUser.displayName || 'User'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign Out
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Get Started
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};