import React from 'react';
import { Plus, Pencil, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Flashcard } from '../../services/collections';

interface FlashcardPreviewProps {
  flashcard: Flashcard;
  index: number;
  onAddToCollection: (flashcard: Flashcard) => void;
  onEdit: (flashcard: Flashcard) => void;
  isAdded?: boolean;
}

export const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({
  flashcard,
  index,
  onAddToCollection,
  onEdit,
  isAdded = false,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Front</h4>
            <p className="mt-1">{flashcard.front}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Back</h4>
            <p className="mt-1">{flashcard.back}</p>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => onEdit(flashcard)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          {isAdded ? (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1 text-green-600 border-green-600"
              onClick={() => onAddToCollection(flashcard)}
            >
              <Check className="h-4 w-4" />
              Added
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => onAddToCollection(flashcard)}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};