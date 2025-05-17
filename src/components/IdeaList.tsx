import React, { useState } from 'react';
import { Idea } from '@/types';
import IdeaCard from '@/components/IdeaCard';
import { FiStar, FiFilter, FiPlus } from 'react-icons/fi';

interface IdeaListProps {
  ideas: Idea[];
  onSwipe: (idea: Idea, direction: 'left' | 'right') => void;
  onEdit: (idea: Idea) => void;
  onAddIdea?: () => void;
}

const statusOptions = [
  { key: 'all', label: 'All', color: 'bg-white/70 text-gray-700 border-gray-200' },
  { key: 'open', label: 'Open', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { key: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
  { key: 'discarded', label: 'Discarded', color: 'bg-red-100 text-red-700 border-red-200' },
] as const;

type StatusFilter = typeof statusOptions[number]['key'];

const IdeaList: React.FC<IdeaListProps> = ({ ideas, onSwipe, onEdit, onAddIdea }) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const filteredIdeas = ideas.filter((idea) => {
    const statusOk = statusFilter === 'all' || idea.status === statusFilter;
    const favOk = !favoriteOnly || idea.favorite;
    return statusOk && favOk;
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-6 justify-center">
      {onAddIdea && (
          <button
            onClick={onAddIdea}
            className="flex items-center gap-2 ml-4 bg-white/95 text-gray-700 border border-gray-200 px-6 py-2 rounded-full shadow-card hover:shadow-card-hover hover:scale-102 transition-card focus:outline-none font-semibold"
            style={{ minHeight: '40px' }}
          >
            <FiPlus className="text-lg" />
            <span>New Idea</span>
          </button>
        )}
        <div className="flex gap-1 rounded-xl bg-white/40 p-1 border border-white/60 shadow-card">
          {statusOptions.map((opt) => (
            <button
              key={opt.key}
              className={`px-4 py-1 rounded-full border text-sm font-medium transition-all focus:outline-none ${
                statusFilter === opt.key
                  ? `${opt.color} font-semibold shadow-card`
                  : 'bg-white/0 text-gray-400 border-transparent hover:bg-white/20'
              }`}
              style={{ borderWidth: 1 }}
              onClick={() => setStatusFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          className={`flex items-center gap-1 px-4 py-1 rounded-full border text-sm font-medium transition-all focus:outline-none shadow-card ${
            favoriteOnly
              ? 'bg-yellow-100 text-yellow-700 border-yellow-200 font-semibold'
              : 'bg-white/0 text-gray-400 border-transparent hover:bg-yellow-50'
          }`}
          style={{ borderWidth: 1 }}
          onClick={() => setFavoriteOnly((f) => !f)}
          aria-label="Show only favorites"
        >
          <FiStar className={favoriteOnly ? 'text-yellow-400' : 'text-gray-400'} />
          Favorites
        </button>
      </div>
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-card p-card-padding">
          <p className="text-text-secondary">No ideas match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 auto-rows-fr">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className="h-full">
              <IdeaCard
                idea={idea}
                onSwipe={(direction) => onSwipe(idea, direction)}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default IdeaList;
