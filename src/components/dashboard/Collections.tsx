import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { CollectionCard } from '../collections/CollectionCard';
import { CreateCollectionModal } from '../collections/CreateCollectionModal';
import { CollectionDetailsModal } from '../collections/CollectionDetailsModal';
import { Collection } from '../../services/collections';

interface CollectionsTabProps {
  collections: Collection[];
  onCollectionCreated: () => void;
  onCollectionDeleted: () => void;
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({
  collections,
  onCollectionCreated,
  onCollectionDeleted,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  return (
    <div className="relative">
      {collections.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onClick={(collection) => setSelectedCollection(collection)}
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

      {collections.length > 0 && (
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-8 right-8 flex items-center justify-center rounded-full p-4 shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Collection
        </Button>
      )}

      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCollectionCreated={onCollectionCreated}
      />

      {selectedCollection && (
        <CollectionDetailsModal
          isOpen={true}
          onClose={() => setSelectedCollection(null)}
          collection={selectedCollection}
          onDelete={onCollectionDeleted}
        />
      )}
    </div>
  );
};