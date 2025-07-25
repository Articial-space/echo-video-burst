
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";
import VideoSummary from "@/components/VideoSummary";
import VideoHistory from "@/components/VideoHistory";
import TypingAnimation from "@/components/TypingAnimation";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Clock, Target, Zap, History, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  summary?: any;
  sections?: any;
}

const Index = () => {
  const [currentVideoData, setCurrentVideoData] = useState<VideoData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleVideoProcessed = async (videoData: VideoData) => {
    setCurrentVideoData(videoData);
    
    // Save video to database if user is authenticated
    if (user) {
      try {
        const { error } = await supabase
          .from('videos')
          .insert({
            user_id: user.id,
            title: videoData.title,
            url: videoData.url,
            duration: videoData.duration,
            thumbnail: videoData.thumbnail,
            summary: videoData.summary || null,
            sections: videoData.sections || null
          });

        if (error) {
          console.error('Error saving video:', error);
          toast({
            title: "Note",
            description: "Video processed but not saved. Please sign in to save your summaries.",
          });
        }
      } catch (error) {
        console.error('Error saving video:', error);
      }
    }
  };

  const handleBackToUpload = () => {
    setCurrentVideoData(null);
    setShowHistory(false);
  };

  const features = [
    {
      icon: Upload,
      title: "Smart Analysis",
      description: "AI-powered video analysis that understands context and extracts key insights automatically."
    },
    {
      icon: Clock,
      title: "Instant Timestamps",
      description: "Jump to any section with precise timestamps for efficient navigation."
    },
    {
      icon: Target,
      title: "Section Breakdown",
      description: "Automatically divide videos into digestible sections with clear summaries."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in seconds. Save time and stay informed."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        <div className="gradient-mesh min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <LoadingSkeleton type="upload" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          {!currentVideoData && !showHistory ? (
            <>
              {/* Hero Section */}
              <div className="text-center space-y-6 mb-12 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up">
                  Transform Videos into
                  <span className="block animate-float">
                    <TypingAnimation words={["summary", "insight", "knowledge"]} />
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
                  Upload any video or paste a URL to get instant AI-powered summaries with precise timestamps.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-slide-up [animation-delay:400ms]">
                  <Button 
                    size="lg" 
                    className="bg-brand-gradient hover:opacity-90 text-white px-6 py-3 transition-all duration-200"
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  {user && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-6 py-3 border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50 transition-all duration-200"
                      onClick={() => setShowHistory(true)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  )}
                </div>
              </div>

              {/* Upload Section */}
              <div id="upload-section" className="mb-16">
                <VideoUpload onVideoProcessed={handleVideoProcessed} />
              </div>

              {/* Features Section */}
              <section id="features" className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Why Choose Viel?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Built for professionals who need to extract value from video content quickly.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((feature, index) => (
                    <Card 
                      key={index} 
                      className="p-6 glass-effect group hover:shadow-lg transition-all duration-300 border-0 hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center group-hover:animate-pulse-green transition-transform duration-200 group-hover:rotate-12">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* CTA Section */}
              <section className="mt-16 text-center">
                <Card className="p-8 glass-effect border-0">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Ready to get started?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Join thousands of professionals who save hours every week.
                    </p>
                    <Button 
                      size="lg"
                      className="bg-brand-gradient hover:opacity-90"
                      onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Start Analyzing Videos
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </section>
            </>
          ) : showHistory ? (
            <VideoHistory onBack={handleBackToUpload} onVideoSelect={setCurrentVideoData} />
          ) : (
            <VideoSummary 
              videoData={currentVideoData} 
              onBack={handleBackToUpload}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <Link to="/" className="flex items-center">
                <span className="text-lg font-bold brand-text-gradient">Viel</span>
              </Link>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-brand-green-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-brand-green-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-brand-green-600 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
