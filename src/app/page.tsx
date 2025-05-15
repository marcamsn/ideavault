"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Idea } from '@/types'
import IdeaCard from '@/components/IdeaCard'
import AddIdeaModal from '@/components/AddIdeaModal'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  const supabase = createClientComponentClient()

  // Redirect to sign in if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchIdeas()
    }
  }, [user])

  async function fetchIdeas() {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })
      // Filtro por user_id para asegurar que solo se obtienen las ideas del usuario actual
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error fetching ideas:', error)
      return
    }

    setIdeas(data || [])
  }

  async function handleSwipe(idea: Idea, direction: 'left' | 'right') {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ favorite: direction === 'right' })
        .eq('id', idea.id)

      if (error) throw error
      await fetchIdeas()
    } catch (error) {
      console.error('Error updating idea:', error)
    }
  }

  // Don't render anything while checking authentication status
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null
  }
  
  // Mostrar ideas de ejemplo en la vista previa de Windsurf si no hay ideas reales
  const isWindsurfPreview = typeof window !== 'undefined' && window.location.hostname === '127.0.0.1';
  const displayIdeas = ideas.length > 0 ? ideas : isWindsurfPreview ? [
    {
      id: 'preview-1',
      text: 'Esta es una idea de ejemplo para la vista previa de Windsurf',
      tags: ['preview', 'ejemplo'],
      mood: 'happy',
      favorite: true,
      image_url: null,
      created_at: new Date().toISOString(),
      user_id: user.id
    },
    {
      id: 'preview-2',
      text: 'Las ideas reales aparecerán cuando accedas desde un navegador normal',
      tags: ['preview', 'información'],
      mood: 'dreamy',
      favorite: false,
      image_url: null,
      created_at: new Date().toISOString(),
      user_id: user.id
    }
  ] : []

  return (
    <div className="relative">
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">IdeaVault</h1>
            <button
              onClick={() => signOut()}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Sign Out
            </button>
          </div>
          
          <div className="flex justify-center mb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add New Idea
            </button>
          </div>

          {displayIdeas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No ideas yet. Add your first idea!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onSwipe={(direction) => handleSwipe(idea, direction)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <AddIdeaModal
            onClose={() => setShowModal(false)}
            onSuccess={fetchIdeas}
          />
        </div>
      )}
    </div>
  )
}
