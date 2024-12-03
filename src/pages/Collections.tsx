import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { CollectionCard } from '../components/collections/CollectionCard';
import { PublicCollectionDetailsModal } from '../components/collections/PublicCollectionDetailsModal';
import { Collection } from '../services/collections';
import { subscribeToPublicCollections } from '../services/collections';

export const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToPublicCollections(
      (updatedCollections) => {
        // Get 12 random collections
        const randomCollections = [...updatedCollections]
          .filter(c => c.visibility === 'public')
          .sort(() => Math.random() - 0.5)
          .slice(0, 12);
        setCollections(randomCollections);
        setLoading(false);
      },
      (error) => {
        setError('Failed to load collections');
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-teal-50 to-white">
        <Container className="py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Discover Public Collections
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Explore and practice with community-created flashcard collections
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-transparent"></div>
          </div>
        ) : filteredCollections.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center text-2xl font-bold text-gray-900">
                <Sparkles className="mr-2 h-6 w-6 text-teal-500" />
                Featured Collections
              </h2>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Shuffle Collections
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={(collection) => setSelectedCollection(collection)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No collections found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or check back later for new collections
            </p>
          </div>
        )}

        {selectedCollection && (
          <PublicCollectionDetailsModal
            isOpen={true}
            onClose={() => setSelectedCollection(null)}
            collection={selectedCollection}
          />
        )}
      </Container>
    </div>
  );
};