import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Idea } from '@/types'

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

  const MOODS = ['happy', 'playful', 'dreamy', 'wild']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = null
      if (image) {
        const { data, error } = await supabase.storage
          .from('idea-images')
          .upload(`idea-${Date.now()}-${image.name}`, image)

        if (error) throw error
        imageUrl = data.path
      }

      const { error } = await supabase.from('ideas').insert({
        text,
        tags,
        mood,
        favorite,
        image_url: imageUrl
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Idea</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Idea Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={tags.join(',')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Favorite</label>
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isLoading ? 'Adding...' : 'Add Idea'}
          </button>
        </div>
      </form>
    </div>
  )
}
