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
      className="relative bg-white/20 bg-gradient-to-br from-pastel-pink/30 via-pastel-blue/20 to-pastel-purple/20 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.07)] p-5 cursor-pointer transition-transform duration-150 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] flex flex-col h-full border border-white/20 backdrop-blur-2xl"
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.07), 0 1px 0 0 rgba(255,255,255,0.3) inset' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => onEdit(idea)}
    >
      <div className="flex-1 flex flex-col">
        {idea.image_url ? (
          <div className="h-32 mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-pastel-pink/30 to-pastel-blue/20 flex items-center justify-center">
            <img
              src={idea.image_url}
              alt="Idea"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 mb-3">
            <span className="text-5xl text-gray-700 opacity-80 drop-shadow-sm">{moodEmoji}</span>
          </div>
        )}
        
        <div className="space-y-2 text-center mb-1">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-body text-text-secondary text-left flex-1 line-clamp-3">{idea.text}</h3>
            {!idea.image_url && <span className="text-xl ml-2 flex-shrink-0">{moodEmoji}</span>}
          </div>
          
          {idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {idea.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-0.5 text-xs bg-white/30 text-gray-700 rounded-full shadow-inner border border-white/30 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-white/20">
        <span className="flex items-center">
          {idea.favorite ? (
            <span className="text-yellow-400 mr-1">⭐</span>
          ) : (
            <span className="text-gray-300 mr-1">☆</span>
          )}
          {idea.favorite ? 'Favorited' : 'Not favorited'}
        </span>
        <span>
          <span className={`px-3 py-0.5 text-xs rounded-full font-semibold shadow-inner border border-white/30 
            ${idea.status === 'open' ? 'bg-green-100 text-green-700' : idea.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}
          >
            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
          </span>
        </span>
      </div>
    </div>
  )
}
