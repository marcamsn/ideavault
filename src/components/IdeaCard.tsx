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
      className="relative bg-white rounded-lg shadow-md p-4 cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {idea.image_url && (
        <img
          src={idea.image_url}
          alt="Idea"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{idea.text}</h3>
          <span className="text-yellow-500 text-2xl">{moodEmoji}</span>
        </div>
        
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {idea.favorite ? '⭐ Favorited' : '☆ Not favorited'}
          </span>
          <span>
            {new Date(idea.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}
