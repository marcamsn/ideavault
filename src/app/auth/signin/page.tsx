"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.MouseEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      alert('Check your email for the confirmation link!')
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple p-screen-padding">
      <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-card p-8 w-full max-w-md transition-card">
        <h1 className="text-title font-heading text-text-primary mb-6 text-center">Sign in to IdeaVault</h1>
        
        {error && (
          <div className="bg-red-400/20 backdrop-blur-md border border-red-400/30 text-red-700 px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-text-secondary font-body mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/30 backdrop-blur-md border-0 rounded-xl text-text-secondary focus:ring-2 focus:ring-pastel-purple/50 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-text-secondary font-body mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/30 backdrop-blur-md border-0 rounded-xl text-text-secondary focus:ring-2 focus:ring-pastel-purple/50 focus:outline-none"
              required
            />
          </div>
          
          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-white/50 backdrop-blur-md text-text-primary rounded-full shadow-card hover:shadow-card-hover hover:scale-102 transition-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
            
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full px-6 py-3 bg-white/30 backdrop-blur-md text-text-secondary rounded-full shadow-card hover:shadow-card-hover hover:scale-102 transition-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
