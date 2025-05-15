"use client"

import { useState } from 'react'
import { Idea } from '@/types'

interface IdeaCardProps {
  idea: Idea
  onSwipe: (direction: 'left' | 'right') => void
}

export default function IdeaCard({ idea, onSwipe }: IdeaCardProps) {
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
      className="relative bg-white/15 backdrop-blur-xl rounded-2xl shadow-card p-card-padding cursor-pointer transition-card hover:scale-102 hover:shadow-card-hover"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {idea.image_url && (
        <img
          src={idea.image_url}
          alt="Idea"
          className="w-full h-48 object-cover rounded-2xl mb-4"
        />
      )}
      
      <div className="space-y-3 text-center">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-body text-text-secondary">{idea.text}</h3>
          <span className="text-2xl">{moodEmoji}</span>
        </div>
        
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-card-label bg-white/20 backdrop-blur-md text-text-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between text-card-label text-text-muted">
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
    </div>
  )
}
