import React, { useState, useEffect } from 'react';
import { BookOpen, User, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { useAuth } from '../contexts/AuthContext';
import { Collection, subscribeToUserCollections } from '../services/collections';
import { TabSystem } from '../components/dashboard/TabSystem';
import { CollectionsTab } from '../components/dashboard/Collections';
import { Profile } from '../components/dashboard/Profile';
import { Generate } from '../components/dashboard/Generate';

const tabs = [
  { id: 'collections', label: 'Flashcard Collections', icon: BookOpen },
  { id: 'generate', label: 'Generate', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: User },
];

const ACTIVE_TAB_KEY = 'flashcardhero_active_tab';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(ACTIVE_TAB_KEY) || 'collections';
  });
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserCollections(
      currentUser.uid,
      (updatedCollections) => {
        setCollections(updatedCollections);
        setLoading(false);
      },
      (error) => {
        setError('Failed to load collections');
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleCollectionCreated = () => {
    // Collection will be automatically added through the subscription
  };

  const handleCollectionDeleted = () => {
    // Collection will be automatically removed through the subscription
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser?.displayName}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your flashcard collections and track your learning progress
          </p>
        </div>

        <TabSystem
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {activeTab === 'collections' && (
                <CollectionsTab
                  collections={collections}
                  onCollectionCreated={handleCollectionCreated}
                  onCollectionDeleted={handleCollectionDeleted}
                />
              )}
              {activeTab === 'generate' && (
                <Generate collections={collections} />
              )}
              {activeTab === 'profile' && <Profile />}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};