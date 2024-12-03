import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Rotate3D, Shuffle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Collection, subscribeToCollection } from '../services/collections';

export const Practice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flashcards, setFlashcards] = useState<Array<{ front: string; back: string }>>([]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToCollection(
      id,
      (updatedCollection) => {
        if (!updatedCollection) {
          setError('Collection not found');
          return;
        }

        // Only allow access to public collections for non-authenticated users
        if (updatedCollection.visibility !== 'public') {
          setError('This collection is private');
          return;
        }

        setCollection(updatedCollection);
        setFlashcards([...updatedCollection.flashcards]);
        setLoading(false);
      },
      (error) => {
        setError('Failed to load collection');
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Container className="py-8">
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error || 'Collection not found'}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/collections')}
          >
            Back to Collections
          </Button>
        </Container>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];
  const totalCards = flashcards.length;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleRandomize = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container className="py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              variant="outline"
              className="inline-flex items-center justify-center"
              onClick={() => navigate('/collections')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collections
            </Button>
            <Button
              variant="outline"
              className="inline-flex items-center justify-center"
              onClick={handleRandomize}
            >
              <Shuffle className="mr-2 h-4 w-4" /> Randomize Cards
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">{collection.name}</h1>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Card {currentCardIndex + 1} of {totalCards}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div
            className="group relative mx-auto aspect-[3/2] w-full cursor-pointer perspective-1000"
            onClick={handleFlip}
          >
            <div
              className={`absolute inset-0 transform-style-3d transition-transform duration-500 ${
                showAnswer ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of card */}
              <div className="absolute inset-0 flex transform items-center justify-center rounded-xl border border-teal-100 bg-white p-8 shadow-lg backface-hidden">
                <div className="text-center">
                  <p className="text-xl text-gray-900">{currentCard.front}</p>
                  <p className="mt-4 text-sm text-gray-500">Click to flip</p>
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute inset-0 flex transform items-center justify-center rounded-xl border border-teal-100 bg-white p-8 shadow-lg rotate-y-180 backface-hidden">
                <div className="text-center">
                  <p className="text-xl text-gray-900">{currentCard.back}</p>
                  <p className="mt-4 text-sm text-gray-500">Click to flip back</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className="flex flex-col items-center gap-1 py-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <Button
              onClick={handleFlip}
              className="flex flex-col items-center gap-1 py-3"
            >
              <Rotate3D className="h-4 w-4" />
              <span>Flip Card</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentCardIndex === totalCards - 1}
              className="flex flex-col items-center gap-1 py-3"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Next</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};