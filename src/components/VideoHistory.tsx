
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Play, Clock, Trash2, Upload, BarChart3, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  summary?: Json | null;
  sections?: Json | null;
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

  const fetchVideos = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to 50 most recent videos

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
  }, [user?.id, toast]);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user, fetchVideos]);

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

  const filteredVideos = useMemo(() => 
    videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    ), [videos, searchQuery]
  );

  const getTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  }, []);

  const stats = useMemo(() => ({
    totalVideos: videos.length,
    withSummaries: videos.filter(v => v.summary).length,
    lastAnalysis: videos[0] ? getTimeAgo(videos[0].created_at) : 'Never'
  }), [videos, getTimeAgo]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your videos...</p>
        </div>
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
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
              Video History
            </h1>
            <p className="text-muted-foreground flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>{stats.totalVideos} video{stats.totalVideos !== 1 ? 's' : ''} analyzed</span>
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
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-brand-gradient rounded-full flex items-center justify-center shadow-lg">
              <Upload className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {searchQuery ? 'No videos found' : 'Start analyzing videos'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms to find what you\'re looking for.' 
                  : 'Upload your first video to get started with AI-powered analysis and summaries.'
                }
              </p>
            </div>
            {!searchQuery && (
              <Button
                onClick={onBack}
                className="bg-brand-gradient hover:opacity-90 text-white shadow-lg px-6 py-3"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Video
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="p-6 glass-effect group hover:shadow-xl transition-all duration-300 border-brand-green-200 hover:border-brand-green-300">
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-brand-green-400 to-brand-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Play className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-200" />
                </div>

                {/* Video Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-brand-green-600 transition-colors text-gray-900 text-lg">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{getTimeAgo(video.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => onVideoSelect(video)}
                    className="flex-1 bg-brand-gradient hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    size="sm"
                  >
                    <Play className="h-3 w-3 mr-2" />
                    View Summary
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteVideo(video.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Section */}
      {videos.length > 0 && (
        <Card className="p-6 glass-effect border-brand-green-200 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-brand-green-600">{stats.totalVideos}</div>
              <div className="text-sm text-muted-foreground">Total Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-green-600">{stats.withSummaries}</div>
              <div className="text-sm text-muted-foreground">With Summaries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-green-600">{stats.lastAnalysis}</div>
              <div className="text-sm text-muted-foreground">Last Analysis</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VideoHistory;
