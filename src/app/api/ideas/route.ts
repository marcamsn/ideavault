import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tags = searchParams.get('tags')?.split(',') || []
    const mood = searchParams.get('mood')
    const favorite = searchParams.get('favorite') === 'true'

    let query = supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (tags.length > 0) {
      query = query.or(tags.map(tag => `tags.contains.${tag}`).join(','))
    }

    if (mood) {
      query = query.eq('mood', mood)
    }

    if (favorite) {
      query = query.eq('favorite', true)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { error } = await supabase.from('ideas').insert(data)

    if (error) throw error

    return NextResponse.json({ message: 'Idea created successfully' })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
