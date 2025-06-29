
import { useState } from "react";
import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";
import VideoSummary from "@/components/VideoSummary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Upload, Clock, Zap, Target, Users } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
}

const Index = () => {
  const [currentVideoData, setCurrentVideoData] = useState<VideoData | null>(null);

  const handleVideoProcessed = (videoData: VideoData) => {
    setCurrentVideoData(videoData);
  };

  const handleBackToUpload = () => {
    setCurrentVideoData(null);
  };

  const features = [
    {
      icon: Search,
      title: "Smart Analysis",
      description: "AI-powered video analysis that understands context and extracts key insights automatically."
    },
    {
      icon: Clock,
      title: "Timestamp Navigation",
      description: "Jump to any section instantly with precise timestamps for efficient video consumption."
    },
    {
      icon: Target,
      title: "Section Breakdown",
      description: "Automatically divide long videos into digestible sections with clear summaries."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in seconds, not hours. Save time and stay informed."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          {!currentVideoData ? (
            <>
              {/* Hero Section */}
              <div className="text-center space-y-8 mb-16">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Transform Videos into
                    <span className="block bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
                      Actionable Insights
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Upload any video or paste a URL to get instant AI-powered summaries, 
                    organized by sections with precise timestamps for easy navigation.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-brand-gradient hover:opacity-90 text-white px-8 py-3 text-lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Video
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-8 py-3 text-lg border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Try with URL
                  </Button>
                </div>
              </div>

              {/* Upload Component */}
              <VideoUpload onVideoProcessed={handleVideoProcessed} />

              {/* Features Section */}
              <section className="mt-20 space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Why Choose VideoSummarizer?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Built for professionals who need to extract value from video content quickly and efficiently.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((feature, index) => (
                    <Card key={index} className="p-6 glass-effect group hover:shadow-lg transition-all duration-300">
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center group-hover:animate-pulse-green">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Stats Section */}
              <section className="mt-20 py-12">
                <Card className="p-8 glass-effect text-center">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-brand-green-600">10K+</div>
                      <div className="text-muted-foreground">Videos Processed</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-brand-green-600">95%</div>
                      <div className="text-muted-foreground">Time Saved</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-brand-green-600">4.9★</div>
                      <div className="text-muted-foreground">User Rating</div>
                    </div>
                  </div>
                </Card>
              </section>
            </>
          ) : (
            <VideoSummary 
              videoData={currentVideoData} 
              onBack={handleBackToUpload}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="h-6 w-6 rounded bg-brand-gradient flex items-center justify-center">
                  <Search className="h-3 w-3 text-white" />
                </div>
                <span className="font-semibold">VideoSummarizer</span>
              </div>
              
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
