import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Plus, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateFlashcards } from '../../lib/claude';
import type { Collection, Flashcard } from '../../services/collections';
import { createCollection, updateCollection } from '../../services/collections';
import { useAuth } from '../../contexts/AuthContext';
import { AddToCollectionModal } from './AddToCollectionModal';
import { FlashcardPreview } from './FlashcardPreview';
import { EditFlashcardModal } from './EditFlashcardModal';

interface GenerateProps {
  collections: Collection[];
}

const STORAGE_KEY = 'flashcardhero_generated_state';

interface GeneratedState {
  content: string;
  name: string;
  count: number;
  flashcards: Flashcard[];
  addedFlashcards: Record<string, boolean>;
}

export const Generate: React.FC<GenerateProps> = ({ collections }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const [addedFlashcards, setAddedFlashcards] = useState<Record<string, boolean>>({});
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [flashcardToEdit, setFlashcardToEdit] = useState<Flashcard | null>(null);

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state: GeneratedState = JSON.parse(savedState);
      setContent(state.content);
      setName(state.name);
      setCount(state.count);
      setGeneratedFlashcards(state.flashcards);
      setAddedFlashcards(state.addedFlashcards);
    }
  }, []);

  // Save state
  useEffect(() => {
    const state: GeneratedState = {
      content,
      name,
      count,
      flashcards: generatedFlashcards,
      addedFlashcards,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [content, name, count, generatedFlashcards, addedFlashcards]);

  const clearState = () => {
    setContent('');
    setName('');
    setCount(5);
    setGeneratedFlashcards([]);
    setAddedFlashcards({});
    localStorage.removeItem(STORAGE_KEY);
    setSuccess('Generated content cleared successfully!');
  };

  const handleGenerate = async () => {
    if (!content) {
      setError('Please enter some content');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const flashcards = await generateFlashcards(content, count);
      setGeneratedFlashcards(flashcards);
      setAddedFlashcards({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!currentUser) return;
    if (!name) {
      setError('Please enter a collection name');
      return;
    }
    if (generatedFlashcards.length === 0) {
      setError('Please generate flashcards first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createCollection(currentUser.uid, {
        name: name.trim(),
        description: `Generated from content using AI`,
        visibility: 'private',
        flashcards: generatedFlashcards
      });

      setSuccess('Collection created successfully!');
      clearState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (!currentUser) return;
    
    const flashcardsToAdd = selectedFlashcard ? [selectedFlashcard] : generatedFlashcards;
    
    if (flashcardsToAdd.length === 0) {
      setError('No flashcards selected');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) throw new Error('Collection not found');

      await updateCollection(collectionId, {
        flashcards: [...collection.flashcards, ...flashcardsToAdd]
      });

      if (selectedFlashcard) {
        const key = `${selectedFlashcard.front}-${selectedFlashcard.back}`;
        setAddedFlashcards(prev => ({ ...prev, [key]: true }));
      } else {
        const newAddedFlashcards: Record<string, boolean> = {};
        flashcardsToAdd.forEach(card => {
          const key = `${card.front}-${card.back}`;
          newAddedFlashcards[key] = true;
        });
        setAddedFlashcards(newAddedFlashcards);
      }

      setSuccess(
        selectedFlashcard
          ? `Flashcard added to "${collection.name}" successfully!`
          : `${flashcardsToAdd.length} flashcards added to "${collection.name}" successfully!`
      );

      setSelectedFlashcard(null);
      setIsAddToCollectionModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update collection');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingleFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setIsAddToCollectionModalOpen(true);
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setFlashcardToEdit(flashcard);
  };

  const handleSaveEdit = (editedFlashcard: Flashcard) => {
    if (!flashcardToEdit) return;

    const oldKey = `${flashcardToEdit.front}-${flashcardToEdit.back}`;
    const newKey = `${editedFlashcard.front}-${editedFlashcard.back}`;
    
    setGeneratedFlashcards(prev =>
      prev.map(card =>
        card.front === flashcardToEdit.front && card.back === flashcardToEdit.back
          ? editedFlashcard
          : card
      )
    );

    // Update added status for edited flashcard
    if (addedFlashcards[oldKey]) {
      setAddedFlashcards(prev => {
        const updated = { ...prev };
        delete updated[oldKey];
        updated[newKey] = true;
        return updated;
      });
    }

    setFlashcardToEdit(null);
    setSuccess('Flashcard updated successfully!');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-teal-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
            <Sparkles className="h-6 w-6 text-teal-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">AI Flashcard Generator</h2>
            <p className="text-sm text-gray-500">
              Paste your content and let AI generate flashcards for you
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center rounded-md bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle className="mr-2 h-5 w-5" />
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Paste your text content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Flashcards
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              min="1"
              max="200"
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={loading || !content}
              className="inline-flex items-center justify-center px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-5 w-5" />
                  <span>Generate Flashcards</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {generatedFlashcards.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">Generated Flashcards</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={clearState}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {Object.keys(addedFlashcards).length} of {generatedFlashcards.length} cards added
                </p>
              </div>
              {generatedFlashcards.map((card, index) => (
                <FlashcardPreview
                  key={index}
                  flashcard={card}
                  index={index}
                  onAddToCollection={handleAddSingleFlashcard}
                  onEdit={handleEditFlashcard}
                  isAdded={addedFlashcards[`${card.front}-${card.back}`]}
                />
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter a name for your collection"
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleCreateCollection}
                  disabled={loading || !name}
                  className="inline-flex items-center justify-center px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      <span>Creating Collection...</span>
                    </>
                  ) : (
                    'Create Collection'
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFlashcard(null);
                    setIsAddToCollectionModalOpen(true);
                  }}
                  disabled={loading || collections.length === 0}
                  className="inline-flex items-center justify-center px-8"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add All to Existing Collection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddToCollectionModal
        isOpen={isAddToCollectionModalOpen}
        onClose={() => {
          setIsAddToCollectionModalOpen(false);
          setSelectedFlashcard(null);
        }}
        collections={collections}
        onSelect={handleAddToCollection}
      />

      {flashcardToEdit && (
        <EditFlashcardModal
          isOpen={true}
          onClose={() => setFlashcardToEdit(null)}
          flashcard={flashcardToEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};
