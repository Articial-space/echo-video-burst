-- Add sharing functionality to videos table
ALTER TABLE public.videos 
ADD COLUMN is_public BOOLEAN DEFAULT FALSE,
ADD COLUMN share_token UUID DEFAULT gen_random_uuid() UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_videos_share_token ON public.videos(share_token);
CREATE INDEX idx_videos_public ON public.videos(is_public);

-- Create policy for public access to shared videos
CREATE POLICY "Anyone can view shared videos" 
ON public.videos 
FOR SELECT 
USING (is_public = true);

-- Update existing videos to have share tokens
UPDATE public.videos SET share_token = gen_random_uuid() WHERE share_token IS NULL;