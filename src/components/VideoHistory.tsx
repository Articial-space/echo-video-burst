
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Play, Clock, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  summary?: any;
  sections?: any;
  created_at: string;
}

interface VideoHistoryProps {
  onBack: () => void;
  onVideoSelect: (video: VideoData) => void;
}

const VideoHistory = ({ onBack, onVideoSelect }: VideoHistoryProps) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: "Error",
          description: "Failed to load video history.",
          variant: "destructive",
        });
      } else {
        setVideos(data || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) {
        console.error('Error deleting video:', error);
        toast({
          title: "Error",
          description: "Failed to delete video.",
          variant: "destructive",
        });
      } else {
        setVideos(videos.filter(video => video.id !== videoId));
        toast({
          title: "Success",
          description: "Video deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading your videos...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2 hover:bg-brand-green-50 hover:text-brand-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
              Video History
            </h1>
            <p className="text-muted-foreground">
              {videos.length} video{videos.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4 glass-effect border-brand-green-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-green-600" />
          <Input
            placeholder="Search your videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-brand-green-200 focus:border-brand-green-500 focus:ring-brand-green-500"
          />
        </div>
      </Card>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <Card className="p-12 glass-effect text-center border-brand-green-200">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-brand-gradient rounded-full flex items-center justify-center shadow-lg">
              <Play className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {searchQuery ? 'No videos found' : 'No videos yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try adjusting your search terms.' 
                  : 'Upload and analyze your first video to get started!'
                }
              </p>
            </div>
            {!searchQuery && (
              <Button
                onClick={onBack}
                className="bg-brand-gradient hover:opacity-90 text-white shadow-lg"
              >
                Upload Video
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="p-4 glass-effect group hover:shadow-lg transition-all duration-300 border-brand-green-200">
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="aspect-video bg-brand-gradient rounded-lg flex items-center justify-center shadow-md">
                  <Play className="h-8 w-8 text-white" />
                </div>

                {/* Video Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-brand-green-600 transition-colors text-gray-900">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                    </div>
                    <span>
                      {new Date(video.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onVideoSelect(video)}
                    className="flex-1 bg-brand-gradient hover:opacity-90 text-white shadow-md"
                    size="sm"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    View Summary
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteVideo(video.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoHistory;
