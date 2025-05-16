"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Idea } from '@/types'
import IdeaCard from '@/components/IdeaCard'
import AddIdeaModal from '@/components/AddIdeaModal'
import Calendar from '@/components/Calendar'
import IdeaList from '@/components/IdeaList'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import { SidebarMenuProvider, useSidebarMenu } from './SidebarMenuContext'

function HomeContent() {
  const { section, setSection } = useSidebarMenu();
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
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

  async function handleDeleteIdea(ideaId: string) {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId)

      if (error) throw error
      await fetchIdeas()
      setShowModal(false)
      setEditingIdea(null)
    } catch (error) {
      console.error('Error deleting idea:', error)
      alert('Failed to delete idea. Please try again.')
    }
  }

  function handleEditIdea(idea: Idea) {
    setEditingIdea(idea)
    setShowModal(true)
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
    <div className="min-h-screen flex bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple">
      {/* Sidebar */}
      <Sidebar selected={section} onSelect={setSection} onAddIdea={() => setShowModal(true)} />
      {/* Main content wrapper, shifts right on desktop/tablet */}
      <div className="flex-1 md:ml-16 transition-all duration-200">
        <main className="min-h-screen p-screen-padding">
          <div className="max-w-4xl mx-auto">
            {/* Sidebar section content */}
            {section === "ideas" && (
              <>
                {/* Botón de añadir idea con estilo pill */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingIdea(null); // Asegúrate de que estamos añadiendo, no editando
                      setShowModal(true);
                    }}
                    className="bg-white/40 backdrop-blur-lg text-text-primary px-8 py-3 rounded-full shadow-card hover:shadow-card-hover hover:scale-102 transition-card focus:outline-none"
                  >
                    Add New Idea
                  </button>
                </div>
                {/* Contenedor de ideas */}
                <IdeaList
                  ideas={displayIdeas}
                  onSwipe={handleSwipe}
                  onEdit={handleEditIdea}
                />
              </>
            )}
            {section === "calendar" && (
              <Calendar ideas={ideas} />
            )}
          </div>
        </main>
        {/* Modal con estilo frosted glass */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-pastel-purple/30 backdrop-blur-md flex items-center justify-center p-screen-padding">
            <AddIdeaModal
              idea={editingIdea}
              onClose={() => {
                setShowModal(false);
                setEditingIdea(null);
              }}
              onSuccess={fetchIdeas}
              onDelete={handleDeleteIdea}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <SidebarMenuProvider>
      <HomeContent />
    </SidebarMenuProvider>
  );
}
