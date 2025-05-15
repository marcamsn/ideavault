"use client"

import { useState } from 'react'
import { Idea } from '@/types'

interface IdeaCardProps {
  idea: Idea
  onSwipe: (direction: 'left' | 'right') => void
  onEdit: (idea: Idea) => void
}

export default function IdeaCard({ idea, onSwipe, onEdit }: IdeaCardProps) {
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true)
    setSwipeDirection(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return
    
    const touch = e.touches[0]
    const dx = touch.clientX - e.targetTouches[0].clientX
    
    if (Math.abs(dx) > 50) {
      setSwipeDirection(dx > 0 ? 'right' : 'left')
    }
  }

  const handleTouchEnd = () => {
    if (swipeDirection) {
      onSwipe(swipeDirection)
    }
    setIsSwiping(false)
    setSwipeDirection(null)
  }

  const moodEmoji = {
    happy: '😊',
    playful: '🎮',
    dreamy: '💭',
    wild: '🔥'
  }[idea.mood]

  return (
    <div
      className="relative bg-white/15 backdrop-blur-xl rounded-xl shadow-card p-3 cursor-pointer transition-card hover:scale-102 hover:shadow-card-hover flex flex-col h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onEdit(idea)}
    >
      <div className="flex-1 flex flex-col">
        {idea.image_url ? (
          <div className="h-32 mb-3 overflow-hidden rounded-xl">
            <img
              src={idea.image_url}
              alt="Idea"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-14 mb-2">
            <span className="text-4xl opacity-70">{moodEmoji}</span>
          </div>
        )}
        
        <div className="space-y-2 text-center mb-1">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-body text-text-secondary text-left flex-1 line-clamp-3">{idea.text}</h3>
            {!idea.image_url && <span className="text-xl ml-2 flex-shrink-0">{moodEmoji}</span>}
          </div>
          
          {idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {idea.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-white/20 backdrop-blur-md text-text-secondary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-text-muted mt-2 pt-1 border-t border-white/10">
        <span className="flex items-center">
          {idea.favorite ? (
            <span className="text-yellow-500 mr-1">⭐</span>
          ) : (
            <span className="text-pastel-gray-400 mr-1">☆</span>
          )}
          {idea.favorite ? 'Favorited' : 'Not favorited'}
        </span>
        <span>
          {new Date(idea.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
