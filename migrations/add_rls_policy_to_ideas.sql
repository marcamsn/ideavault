-- Enable Row Level Security on ideas table
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own ideas
CREATE POLICY "Users can insert their own ideas" ON ideas
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own ideas
CREATE POLICY "Users can view their own ideas" ON ideas
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to update their own ideas
CREATE POLICY "Users can update their own ideas" ON ideas
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own ideas
CREATE POLICY "Users can delete their own ideas" ON ideas
    FOR DELETE
    USING (auth.uid() = user_id);
