"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Idea } from '@/types'
import IdeaCard from '@/components/IdeaCard'
import AddIdeaModal from '@/components/AddIdeaModal'

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  console.log('Modal state:', showModal); // Debug: estado del modal

  useEffect(() => {
    fetchIdeas()
  }, [])

  async function fetchIdeas() {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })

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

  return (
    <div className="relative">
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">IdeaVault</h1>
          
          <div className="flex justify-center mb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Opening modal');
                setShowModal(true);
                router.refresh(); // Forzar un refresh del componente
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add New Idea
            </button>
          </div>

          <div className="space-y-4">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onSwipe={(direction) => handleSwipe(idea, direction)}
              />
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <AddIdeaModal
            onClose={() => {
              console.log('Closing modal');
              setShowModal(false);
            }}
            onSuccess={fetchIdeas}
          />
        </div>
      )}
    </div>
  )
}
