"use client"

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Idea } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface AddIdeaModalProps {
  idea: Idea | null
  onClose: () => void
  onSuccess: () => void
  onDelete: (ideaId: string) => void
}

export default function AddIdeaModal({ idea, onClose, onSuccess, onDelete }: AddIdeaModalProps) {
  const [text, setText] = useState(idea?.text || '')
  const [tags, setTags] = useState<string[]>(idea?.tags || [])
  const [mood, setMood] = useState<'happy' | 'playful' | 'dreamy' | 'wild'>(idea?.mood as 'happy' | 'playful' | 'dreamy' | 'wild' || 'happy')
  const [favorite, setFavorite] = useState(idea?.favorite || false)
  const [image, setImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(idea?.image_url || null)
  const [isLoading, setIsLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  type MoodType = 'happy' | 'playful' | 'dreamy' | 'wild';
  const MOODS: MoodType[] = ['happy', 'playful', 'dreamy', 'wild'];

  // Referencia para el menú desplegable
  const menuRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar los datos de la idea si estamos editando
  useEffect(() => {
    if (idea) {
      setText(idea.text);
      setTags(idea.tags);
      // Asegurarnos de que el mood sea uno de los valores permitidos
      if (['happy', 'playful', 'dreamy', 'wild'].includes(idea.mood)) {
        setMood(idea.mood as 'happy' | 'playful' | 'dreamy' | 'wild');
      }
      setFavorite(idea.favorite);
      setCurrentImageUrl(idea.image_url);
    }
  }, [idea]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    if (!user) {
      alert('You must be logged in to add an idea')
      setIsLoading(false)
      return
    }

    try {
      let imageUrl = currentImageUrl;
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

      const ideaData = {
        text,
        tags,
        mood,
        favorite,
        image_url: imageUrl,
        user_id: user.id
      };

      let error;

      if (idea) {
        // Actualizar una idea existente
        const { error: updateError } = await supabase
          .from('ideas')
          .update(ideaData)
          .eq('id', idea.id);
        error = updateError;
      } else {
        // Insertar una nueva idea
        const { error: insertError } = await supabase
          .from('ideas')
          .insert(ideaData);
        error = insertError;
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving idea:', error);
      alert('Failed to save idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDeleteClick() {
    if (idea && confirm('Are you sure you want to delete this idea?')) {
      onDelete(idea.id);
    }
  }

  const moodEmojis: Record<MoodType, string> = {
    happy: '😊',
    playful: '🎮',
    dreamy: '💭',
    wild: '🔥'
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-screen-padding">
      <form
        onSubmit={handleSubmit}
        className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-card p-6 max-w-3xl w-full max-h-[90vh] transition-card flex flex-col"
      >
        {/* Encabezado fijo */}
        <div className="flex justify-between items-center mb-4 sticky top-0 z-10">
          <h2 className="text-title font-heading text-text-primary">
            {idea ? 'Edit Idea' : 'Add New Idea'}
          </h2>
          
          {idea && (
            <div className="flex items-center">
              <button 
                type="button" 
                onClick={handleDeleteClick}
                className="px-4 py-2 text-red-500 hover:text-red-600 rounded-full transition-colors flex items-center mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Idea
              </button>
            </div>
          )}
        </div>
        
        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Campo de texto de la idea a ancho completo */}
          <div className="mb-4">
            <label className="block text-text-secondary font-body mb-2">Idea Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 bg-white/30 backdrop-blur-md border-0 rounded-xl text-text-secondary focus:ring-2 focus:ring-pastel-purple/50 focus:outline-none"
              required
              rows={3}
            />
          </div>

          {/* Resto de componentes en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary font-body mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags.join(',')}
                  onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                  className="w-full p-3 bg-white/30 backdrop-blur-md border-0 rounded-xl text-text-secondary focus:ring-2 focus:ring-pastel-purple/50 focus:outline-none"
                  placeholder="creativity, work, future"
                />
              </div>

              <div>
                <label className="block text-text-secondary font-body mb-2">Mood</label>
                <div className="flex justify-between gap-2 mb-2">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`flex flex-col items-center p-2 rounded-xl transition-all ${mood === m ? 'bg-white/40 shadow-card scale-105' : 'bg-white/20 hover:bg-white/30'}`}
                      style={{ flex: '1 1 0' }}
                    >
                      <span className="text-2xl mb-1">{moodEmojis[m]}</span>
                      <span className="text-card-label text-text-secondary">
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center text-text-secondary font-body cursor-pointer p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
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
            </div>

            {/* Columna derecha */}
            <div>
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
              {!image && currentImageUrl && (
                <div className="mt-2">
                  <p className="text-card-label text-text-muted mb-1">Current image:</p>
                  <img 
                    src={currentImageUrl} 
                    alt="Current idea image" 
                    className="w-full h-32 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción a ancho completo - fijos en la parte inferior */}
        <div className="flex justify-center space-x-4 w-full mt-4 pt-4 border-t border-white/20 sticky bottom-0">
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
            {isLoading ? 'Saving...' : idea ? 'Update Idea' : 'Add Idea'}
          </button>
        </div>
      </form>
    </div>
  )
}
