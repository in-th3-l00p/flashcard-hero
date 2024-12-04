import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CollectionForm } from './CollectionForm';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollectionCreated: () => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({ 
  isOpen, 
  onClose,
  onCollectionCreated 
}) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    onClose();
    onCollectionCreated();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Collection</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new flashcard collection to start learning.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center"
            onClick={() => {
              onClose();
              navigate('/collections/create');
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Full Page
          </Button>
        </div>
        <CollectionForm onSuccess={handleSuccess} onCancel={onClose} />
      </div>
    </Modal>
  );
};