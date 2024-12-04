import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Eye, EyeOff, Pencil, Trash2, Play } from 'lucide-react';
import { Collection, deleteCollection } from '../../services/collections';
import { formatDate } from '../../utils/date';
import { DeleteCollectionModal } from './DeleteCollectionModal';
import { EditCollectionModal } from './EditCollectionModal';

interface CollectionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const CollectionDetailsModal: React.FC<CollectionDetailsModalProps> = ({
  isOpen,
  onClose,
  collection,
  onDelete,
  onEdit
}) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCollection(collection.id);
      setIsDeleteModalOpen(false);
      onClose();
      onDelete?.();
    } catch (error) {
      console.error('Error deleting collection:', error);
      setShowDetails(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDetails(false);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setShowDetails(true);
  };

  const handleOpenEditModal = () => {
    setShowDetails(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setShowDetails(true);
  };

  const handleEditSuccess = () => {
    handleCloseEditModal();
    onEdit?.();
  };

  const handlePractice = () => {
    onClose();
    navigate(`/collections/${collection.id}/practice`);
  };

  return (
    <>
      <Modal isOpen={isOpen && showDetails} onClose={onClose}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{collection.name}</h2>
                {collection.visibility === 'private' && (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                {collection.visibility === 'public' && (
                  <Eye className="h-4 w-4 text-teal-500" />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Created {formatDate(collection.createdAt)}
              </p>
            </div>
          </div>

          {collection.description && (
            <p className="text-gray-600">{collection.description}</p>
          )}

          <div className="flex space-x-3">
            <Button
              className="flex items-center"
              onClick={handlePractice}
            >
              <Play className="mr-2 h-4 w-4" /> Practice
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleOpenEditModal}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Collection
            </Button>
            <Button
              variant="outline"
              className="flex items-center text-red-600 hover:bg-red-50"
              onClick={handleOpenDeleteModal}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Collection
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Flashcards ({collection.flashcards.length})
            </h3>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4">
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
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </Modal>

      <DeleteCollectionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        collectionName={collection.name}
        isDeleting={isDeleting}
      />

      <EditCollectionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        collection={collection}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};
