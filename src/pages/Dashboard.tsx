import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { CreateCollectionModal } from '../components/collections/CreateCollectionModal';
import { CollectionCard } from '../components/collections/CollectionCard';
import { CollectionDetailsModal } from '../components/collections/CollectionDetailsModal';
import { Collection, subscribeToUserCollections } from '../services/collections';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserCollections(
      currentUser.uid,
      (updatedCollections) => {
        setCollections(updatedCollections);
        
        // Update selected collection if it exists
        if (selectedCollection) {
          const updatedCollection = updatedCollections.find(
            (c) => c.id === selectedCollection.id
          );
          if (updatedCollection) {
            setSelectedCollection(updatedCollection);
          }
        }
        
        setLoading(false);
      },
      (error) => {
        setError('Failed to load collections');
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, selectedCollection]);

  const handleCollectionCreated = () => {
    setIsCreateModalOpen(false);
  };

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleCollectionDeleted = () => {
    setSelectedCollection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container className="py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {currentUser?.displayName}!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your flashcard collections and track your learning progress
            </p>
          </div>
          <Button 
            className="inline-flex items-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Collection
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-transparent"></div>
          </div>
        ) : collections.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection}
                onClick={handleCollectionClick}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No collections</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new collection</p>
            <div className="mt-6">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="mx-auto flex items-center justify-center"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Collection
              </Button>
            </div>
          </div>
        )}

        <CreateCollectionModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCollectionCreated={handleCollectionCreated}
        />

        {selectedCollection && (
          <CollectionDetailsModal
            isOpen={true}
            onClose={() => setSelectedCollection(null)}
            collection={selectedCollection}
            onDelete={handleCollectionDeleted}
          />
        )}
      </Container>
    </div>
  );
};