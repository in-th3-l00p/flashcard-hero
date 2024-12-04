import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { createCollection, updateCollection } from '../../services/collections';
import { AIAssistant } from './AIAssistant';
import type { Flashcard, CreateCollectionData, Collection } from '../../services/collections';

interface CollectionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  collection?: Collection;
  isEditing?: boolean;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({ 
  onSuccess, 
  onCancel,
  collection,
  isEditing
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [visibility, setVisibility] = useState<'public' | 'private'>(
    collection?.visibility || 'private'
  );
  const [flashcards, setFlashcards] = useState<Flashcard[]>(
    collection?.flashcards || [{ front: '', back: '' }]
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addFlashcard = () => {
    setFlashcards([...flashcards, { front: '', back: '' }]);
    setCurrentCardIndex(flashcards.length);
  };

  const removeFlashcard = (index: number) => {
    if (flashcards.length > 1) {
      const newFlashcards = flashcards.filter((_, i) => i !== index);
      setFlashcards(newFlashcards);
      setCurrentCardIndex(Math.min(currentCardIndex, newFlashcards.length - 1));
    }
  };

  const updateFlashcard = (field: 'front' | 'back', value: string) => {
    const newFlashcards = [...flashcards];
    newFlashcards[currentCardIndex][field] = value;
    setFlashcards(newFlashcards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      const collectionData: CreateCollectionData = {
        name: name.trim(),
        description: description.trim(),
        visibility,
        flashcards: flashcards.map(card => ({
          front: card.front.trim(),
          back: card.back.trim()
        }))
      };

      if (isEditing && collection) {
        await updateCollection(collection.id, collectionData);
      } else {
        await createCollection(currentUser.uid, collectionData);
      }
      
      onSuccess?.();
      if (!onSuccess) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/dashboard');
    }
  };

  const handleFlashcardsGenerated = (generatedFlashcards: Flashcard[]) => {
    setFlashcards(generatedFlashcards);
    setCurrentCardIndex(0);
  };

  const handleFlashcardImproved = (index: number, improved: Flashcard) => {
    const newFlashcards = [...flashcards];
    newFlashcards[index] = improved;
    setFlashcards(newFlashcards);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-lg border border-teal-100 bg-white p-6 shadow-sm">
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Collection Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Visibility</label>
                <div className="mt-1 space-x-4">
                  {(['private', 'public'] as const).map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        value={option}
                        checked={visibility === option}
                        onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                        className="h-4 w-4 border-gray-300 text-teal-500 focus:ring-teal-500"
                      />
                      <span className="ml-2 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Flashcards ({currentCardIndex + 1} of {flashcards.length})
                  </label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFlashcard(currentCardIndex)}
                      disabled={flashcards.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFlashcard}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
                    disabled={currentCardIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <select
                    value={currentCardIndex}
                    onChange={(e) => setCurrentCardIndex(Number(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {flashcards.map((_, index) => (
                      <option key={index} value={index}>
                        Card {index + 1}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentCardIndex(Math.min(flashcards.length - 1, currentCardIndex + 1))}
                    disabled={currentCardIndex === flashcards.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Front</label>
                    <textarea
                      value={flashcards[currentCardIndex].front}
                      onChange={(e) => updateFlashcard('front', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Back</label>
                    <textarea
                      value={flashcards[currentCardIndex].back}
                      onChange={(e) => updateFlashcard('back', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Collection' : 'Create Collection')}
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <AIAssistant
            onFlashcardsGenerated={handleFlashcardsGenerated}
            onFlashcardImproved={handleFlashcardImproved}
            currentFlashcard={flashcards[currentCardIndex]}
            currentIndex={currentCardIndex}
          />
        </div>
      </div>
    </form>
  );
};