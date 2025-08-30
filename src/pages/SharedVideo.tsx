import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import VideoSummary from '@/components/VideoSummary';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  summary?: Json | null;
  sections?: Json | null;
}

const SharedVideo = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedVideo = async () => {
      if (!shareToken) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('share_token', shareToken)
          .eq('is_public', true)
          .maybeSingle();

        if (error) {
          console.error('Error fetching shared video:', error);
          setError('Failed to load video');
          return;
        }

        if (!data) {
          setError('Video not found or not shared');
          return;
        }

        setVideoData({
          id: data.id,
          title: data.title,
          duration: data.duration || '',
          url: data.url || '',
          thumbnail: data.thumbnail || '',
          summary: data.summary,
          sections: Array.isArray(data.sections) ? data.sections : []
        });
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedVideo();
  }, [shareToken]);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading shared video...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              {error || 'Video Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              This video is no longer available or the link is invalid.
            </p>
            <button
              onClick={handleBack}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <VideoSummary videoData={videoData} onBack={handleBack} isSharedView={true} />
    </div>
  );
};

export default SharedVideo;