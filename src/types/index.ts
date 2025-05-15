export interface Idea {
  id: string;
  text: string;
  tags: string[];
  mood: string;
  favorite: boolean;
  image_url?: string | null;
  created_at: string;
  user_id: string;
}
