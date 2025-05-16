import React from 'react';
import { Idea } from '@/types';
import IdeaCard from '@/components/IdeaCard';

interface IdeaListProps {
  ideas: Idea[];
  onSwipe: (idea: Idea, direction: 'left' | 'right') => void;
  onEdit: (idea: Idea) => void;
}

const IdeaList: React.FC<IdeaListProps> = ({ ideas, onSwipe, onEdit }) => {
  if (ideas.length === 0) {
    return (
      <div className="text-center py-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-card p-card-padding">
        <p className="text-text-secondary">No ideas yet. Add your first idea!</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 auto-rows-fr">
      {ideas.map((idea) => (
        <div key={idea.id} className="h-full">
          <IdeaCard
            idea={idea}
            onSwipe={(direction) => onSwipe(idea, direction)}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
};

export default IdeaList;
