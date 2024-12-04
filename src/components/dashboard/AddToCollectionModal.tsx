import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Collection } from '../../services/collections';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onSelect: (collectionId: string) => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  onClose,
  collections,
  onSelect,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select Collection</h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a collection to add the flashcards to
          </p>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {collections.length === 0 ? (
            <p className="text-center text-gray-500">No collections available</p>
          ) : (
            <div className="grid gap-4">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => onSelect(collection.id)}
                  className="flex w-full flex-col items-start rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-teal-500 hover:bg-teal-50"
                >
                  <h3 className="font-medium text-gray-900">{collection.name}</h3>
                  {collection.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {collection.flashcards.length} cards
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};