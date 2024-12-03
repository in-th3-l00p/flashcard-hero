import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Eye, Play } from 'lucide-react';
import { Collection } from '../../services/collections';
import { formatDate } from '../../utils/date';

interface PublicCollectionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
}

export const PublicCollectionDetailsModal: React.FC<PublicCollectionDetailsModalProps> = ({
  isOpen,
  onClose,
  collection,
}) => {
  const navigate = useNavigate();

  const handlePractice = () => {
    onClose();
    navigate(`/collections/${collection.id}/practice`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">{collection.name}</h2>
            <Eye className="h-4 w-4 text-teal-500" />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(collection.createdAt)}
          </p>
        </div>

        {collection.description && (
          <p className="text-gray-600">{collection.description}</p>
        )}

        <Button
          className="flex w-full items-center justify-center"
          onClick={handlePractice}
        >
          <Play className="mr-2 h-4 w-4" /> Practice Now
        </Button>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4">
          <h3 className="sticky top-0 bg-white pb-2 text-lg font-semibold text-gray-900">
            Preview ({collection.flashcards.length} cards)
          </h3>
          <div className="space-y-4">
            {collection.flashcards.map((flashcard, index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Front</h4>
                  <p className="mt-1 text-gray-900">{flashcard.front}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Back</h4>
                  <p className="mt-1 text-gray-900">{flashcard.back}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};