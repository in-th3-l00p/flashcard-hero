import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Collection } from '../../services/collections';
import { formatDate } from '../../utils/date';

interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(collection);
    }
  };

  return (
    <div
      className="group cursor-pointer rounded-lg border border-teal-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600">
          {collection.name}
        </h3>
        <div className="flex items-center space-x-2">
          {collection.visibility === 'private' && (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
          {collection.visibility === 'public' && (
            <Eye className="h-4 w-4 text-teal-500" />
          )}
          {collection.visibility === 'sale' && (
            <CreditCard className="h-4 w-4 text-emerald-500" />
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 line-clamp-2">
        {collection.description || 'No description provided'}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{collection.flashcards.length} cards</span>
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span>{formatDate(collection.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};