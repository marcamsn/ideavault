"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Idea } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface AddIdeaModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddIdeaModal({ onClose, onSuccess }: AddIdeaModalProps) {
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState('happy')
  const [favorite, setFavorite] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const MOODS = ['happy', 'playful', 'dreamy', 'wild']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    if (!user) {
      alert('You must be logged in to add an idea')
      setIsLoading(false)
      return
    }

    try {
      let imageUrl = null
      if (image) {
        const fileName = `idea-${Date.now()}-${image.name}`
        const { data, error } = await supabase.storage
          .from('idea-images')
          .upload(fileName, image)

        if (error) throw error
        
        // Generar la URL pública completa de la imagen
        const { data: urlData } = supabase.storage
          .from('idea-images')
          .getPublicUrl(fileName)
          
        imageUrl = urlData.publicUrl
      }

      const { error } = await supabase.from('ideas').insert({
        text,
        tags,
        mood,
        favorite,
        image_url: imageUrl,
        user_id: user.id  // Add the user ID to the new idea
      })

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding idea:', error)
      alert('Failed to add idea. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const moodEmojis = {
    happy: '😊',
    playful: '🎮',
    dreamy: '💭',
    wild: '🔥'
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-screen-padding">
      <form
        onSubmit={handleSubmit}
        className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-card p-8 max-w-md w-full transition-card"
      >
        <h2 className="text-title font-heading text-text-primary mb-6 text-center">Add New Idea</h2>
        
        <div className="mb-5">
          <label className="block text-text-secondary font-body mb-2">Idea Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 bg-white/30 backdrop-blur-md border-0 rounded-xl text-text-secondary focus:ring-2 focus:ring-pastel-purple/50 focus:outline-none"
            required
            rows={4}
          />
        </div>

        <div className="mb-5">
          <label className="block text-text-secondary font-body mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={tags.join(',')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            className="w-full p-3 bg-white/30 backdrop-blur-md border-0 rounded-xl text-text-secondary focus:ring-2 focus:ring-pastel-purple/50 focus:outline-none"
            placeholder="creativity, work, future"
          />
        </div>

        <div className="mb-5">
          <label className="block text-text-secondary font-body mb-2">Mood</label>
          <div className="flex justify-between mb-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${mood === m ? 'bg-white/40 shadow-card scale-105' : 'bg-white/20 hover:bg-white/30'}`}
              >
                <span className="text-2xl mb-1">{moodEmojis[m as keyof typeof moodEmojis]}</span>
                <span className="text-card-label text-text-secondary">
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="flex items-center text-text-secondary font-body cursor-pointer">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="w-5 h-5 mr-3 accent-pastel-purple"
            />
            <span>Add to favorites</span>
            {favorite && <span className="ml-2">⭐</span>}
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-text-secondary font-body mb-2">Image</label>
          <div className="relative">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              accept="image/*"
              className="w-full p-3 bg-white/30 backdrop-blur-md border-0 rounded-xl text-text-secondary focus:ring-2 focus:ring-pastel-purple/50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/40 file:text-text-secondary hover:file:bg-white/50"
            />
          </div>
          {image && (
            <p className="mt-2 text-card-label text-text-muted">
              Selected: {image.name}
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-white/30 backdrop-blur-md text-text-secondary rounded-full shadow-card hover:shadow-card-hover hover:scale-102 transition-card"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-white/50 backdrop-blur-md text-text-primary rounded-full shadow-card hover:shadow-card-hover hover:scale-102 transition-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Idea'}
          </button>
        </div>
      </form>
    </div>
  )
}
