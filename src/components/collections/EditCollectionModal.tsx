import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CollectionForm } from './CollectionForm';
import { Collection } from '../../services/collections';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
  onSuccess: () => void;
}

export const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  onClose,
  collection,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);

  const handleSuccess = () => {
    setShowForm(true);
    onClose();
    onSuccess();
  };

  return (
    <Modal isOpen={isOpen && showForm} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Collection</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your flashcard collection details
            </p>
          </div>
        </div>
        <CollectionForm
          collection={collection}
          onSuccess={handleSuccess}
          onCancel={onClose}
          isEditing
        />
      </div>
    </Modal>
  );
};