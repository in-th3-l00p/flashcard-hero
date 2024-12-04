import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateFlashcards, improveFlashcard } from '../../lib/claude';
import type { Flashcard } from '../../services/collections';

interface AIAssistantProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  onFlashcardImproved: (index: number, improved: Flashcard) => void;
  currentFlashcard?: Flashcard;
  currentIndex?: number;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onFlashcardsGenerated,
  onFlashcardImproved,
  currentFlashcard,
  currentIndex
}) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const flashcards = await generateFlashcards(topic, count);
      onFlashcardsGenerated(flashcards);
      setTopic('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!currentFlashcard || currentIndex === undefined) return;

    setLoading(true);
    setError('');

    try {
      const improved = await improveFlashcard(currentFlashcard);
      onFlashcardImproved(currentIndex, improved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to improve flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-teal-100 bg-white p-4 shadow-sm">
      <div>
        <h3 className="flex items-center text-lg font-semibold text-gray-900">
          <Sparkles className="mr-2 h-5 w-5 text-teal-500" />
          AI Assistant
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Generate flashcards or improve existing ones using AI
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="e.g., Basic JavaScript Concepts"
          />
        </div>

        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700">
            Number of Flashcards
          </label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            min="1"
            max="20"
          />
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Flashcards
          </Button>

          {currentFlashcard && (
            <Button
              onClick={handleImprove}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Improve Current Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};