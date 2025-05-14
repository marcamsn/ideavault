export interface Idea {
  id: string
  text: string
  image_url?: string
  tags: string[]
  mood: 'happy' | 'playful' | 'dreamy' | 'wild'
  favorite: boolean
  created_at: string
  updated_at: string
}
