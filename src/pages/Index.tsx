
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";
import VideoSummary from "@/components/VideoSummary";
import VideoHistory from "@/components/VideoHistory";
import TypingAnimation from "@/components/TypingAnimation";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Clock, Target, Zap, History, ArrowRight, Plus, BarChart3, PlayCircle, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
  summary?: Json | null;
  sections?: Json | null;
}

const Index = () => {
  const [currentVideoData, setCurrentVideoData] = useState<VideoData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  const { user, loading } = useAuth();
  
  // Check if user needs email verification
  const needsEmailVerification = user && !user.email_confirmed_at;
  const { toast } = useToast();

  const handleVideoProcessed = async (videoData: VideoData) => {
    setCurrentVideoData(videoData);
    setShowUpload(false);
    
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

  const handleBackToDashboard = () => {
    setCurrentVideoData(null);
    setShowHistory(false);
    setShowUpload(false);
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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Authenticated User Dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        <div className="gradient-mesh min-h-screen">
          <Header />
          
          <main className="container mx-auto px-4 py-6">
            {!currentVideoData && !showHistory && !showUpload ? (
              <>
                {/* Welcome Section */}
                <div className="text-center space-y-6 mb-12 animate-fade-in">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-slide-up">
                    Welcome back,
                    <span className="block text-brand-green-600 animate-float">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
                    Ready to analyze more videos? Upload a new video or explore your history.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <Card className="p-8 glass-effect border-brand-green-200 hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => setShowUpload(true)}>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                        <Plus className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Upload New Video</h3>
                        <p className="text-muted-foreground">Analyze a new video and get instant AI-powered summaries</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8 glass-effect border-brand-green-200 hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => setShowHistory(true)}>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                        <History className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">View History</h3>
                        <p className="text-muted-foreground">Access all your previously analyzed videos and summaries</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Features Section */}
                <section className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      Powerful Video Analysis
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Everything you need to extract value from video content quickly.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                      <Card 
                        key={index} 
                        className="p-6 glass-effect group hover:shadow-lg transition-all duration-300 border-brand-green-200"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="space-y-4">
                          <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center group-hover:animate-pulse-green transition-transform duration-200 group-hover:rotate-12">
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              </>
            ) : showHistory ? (
              <VideoHistory onBack={handleBackToDashboard} onVideoSelect={setCurrentVideoData} />
            ) : showUpload ? (
              <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Button
                    variant="ghost"
                    onClick={handleBackToDashboard}
                    className="flex items-center space-x-2 hover:bg-brand-green-50 hover:text-brand-green-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                  </Button>
                </div>
                <VideoUpload onVideoProcessed={handleVideoProcessed} />
              </div>
            ) : (
              <VideoSummary 
                videoData={currentVideoData} 
                onBack={handleBackToDashboard}
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
  }

  // Non-authenticated User Landing Page
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
                  <Link to="/signin?mode=signup">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-6 py-3 border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50 transition-all duration-200"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Email Verification Alert */}
              {needsEmailVerification && (
                <div className="mb-8">
                  <Card className="border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-yellow-800">
                          Please verify your email address to upload and analyze videos.
                        </span>
                        <Link to="/email-verification">
                          <Button variant="outline" size="sm" className="ml-4 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                            Verify Email
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Upload Section */}
              <div id="upload-section" className="mb-16">
                {needsEmailVerification ? (
                  <Card className="p-8 glass-effect border-yellow-200 bg-yellow-50/50">
                    <div className="text-center space-y-4">
                      <Mail className="h-12 w-12 text-yellow-600 mx-auto" />
                      <h3 className="text-xl font-semibold text-yellow-800">Email Verification Required</h3>
                      <p className="text-yellow-700">
                        Please verify your email address to start uploading and analyzing videos.
                      </p>
                      <Link to="/email-verification">
                        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                          <Mail className="h-4 w-4 mr-2" />
                          Verify Email Now
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <VideoUpload onVideoProcessed={handleVideoProcessed} />
                )}
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
                    <Link to="/signin?mode=signup">
                      <Button 
                        size="lg"
                        className="bg-brand-gradient hover:opacity-90"
                      >
                        Start Analyzing Videos
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </section>
            </>
          ) : showHistory ? (
            <VideoHistory onBack={handleBackToDashboard} onVideoSelect={setCurrentVideoData} />
          ) : (
            <VideoSummary 
              videoData={currentVideoData} 
              onBack={handleBackToDashboard}
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
