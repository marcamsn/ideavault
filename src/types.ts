export type IdeaStatus = 'open' | 'completed' | 'discarded';

export interface Idea {
  id: string
  text: string
  image_url?: string
  tags: string[]
  mood: 'happy' | 'playful' | 'dreamy' | 'wild'
  favorite: boolean
  group_id?: string | null
  created_at: string
  updated_at: string
  status: IdeaStatus // 'open' by default
}

// Represents a group (team, workspace, etc.)
export interface Group {
  id: string;
  name: string;
  owner_id?: string | null;
  created_at: string;
}

// Represents a user's membership in a group
export interface GroupUser {
  group_id: string;
  user_id: string;
  role?: string | null;
  joined_at: string;
}
