"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Idea } from '@/types'
import IdeaModal from '@/components/IdeaModal'
import Calendar from '@/components/Calendar'
import IdeaList from '@/components/IdeaList'
import Dashboard from '@/components/Dashboard'
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
      return;
    }

    setIdeas(data || []);
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
      mood: 'happy' as const,
      favorite: true,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id,
      status: 'open' as const,
    },
    {
      id: 'preview-2',
      text: 'Las ideas reales aparecerán cuando accedas desde un navegador normal',
      tags: ['preview', 'información'],
      mood: 'dreamy' as const,
      favorite: false,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id,
      status: 'open' as const,
    }
  ] : []

  return (
    <div className="flex flex-col min-h-screen h-auto bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar selected={section} onSelect={setSection} onAddIdea={() => setShowModal(true)} />
      {/* Main content wrapper, shifts right on desktop/tablet */}
      <div className="flex-1 md:ml-16 transition-all duration-200">
        <main className="min-h-screen p-screen-padding">
          <div className="max-w-4xl mx-auto">
            {/* Sidebar section content */}
            {section === "ideas" && (
              <>
                <IdeaList
                  ideas={displayIdeas}
                  onSwipe={handleSwipe}
                  onEdit={handleEditIdea}
                  onAddIdea={() => {
                    setEditingIdea(null);
                    setShowModal(true);
                  }}
                />
              </>
            )}
            {section === "calendar" && (
              <Calendar ideas={ideas} />
            )}
            {section === "dashboard" && (
              <Dashboard ideas={ideas} />
            )}
          </div>
        </main>
        {/* Modal con estilo frosted glass */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-pastel-purple/30 backdrop-blur-md flex items-center justify-center p-screen-padding">
            <IdeaModal
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
