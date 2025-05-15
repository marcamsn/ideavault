-- Create a storage bucket for idea images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('idea-images', 'idea-images', false)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload files to the idea-images bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'idea-images');

-- Create policy to allow users to view their own uploaded files
CREATE POLICY "Allow users to view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'idea-images' AND auth.uid() = owner);

-- Create policy to allow users to update their own files
CREATE POLICY "Allow users to update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'idea-images' AND auth.uid() = owner);

-- Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'idea-images' AND auth.uid() = owner);
