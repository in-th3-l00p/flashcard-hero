import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  collectionName: string;
  isDeleting: boolean;
}

export const DeleteCollectionModal: React.FC<DeleteCollectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  collectionName,
  isDeleting
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-red-100 p-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Delete Collection</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium">{collectionName}</span>? This action is irreversible and will permanently delete all flashcards in this collection.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Collection'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};