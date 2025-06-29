
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Upload, Zap, Target, ArrowRight, PlayCircle } from 'lucide-react';

const GetStarted = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Video',
      description: 'Drop a video file or paste a YouTube URL to get started instantly.',
      details: [
        'Supports MP4, MOV, AVI, and more',
        'YouTube, Vimeo, and direct URLs',
        'Up to 2GB file size'
      ]
    },
    {
      icon: Zap,
      title: 'AI Analysis',
      description: 'Our advanced AI processes your video and extracts key insights.',
      details: [
        'Content understanding',
        'Topic identification',
        'Key moment detection'
      ]
    },
    {
      icon: Target,
      title: 'Get Your Summary',
      description: 'Receive organized summaries with timestamps and sections.',
      details: [
        'Section breakdowns',
        'Precise timestamps',
        'Downloadable summaries'
      ]
    }
  ];

  const features = [
    {
      title: 'Save Time',
      description: 'Transform hours of video content into digestible summaries in minutes.',
      icon: '⏰'
    },
    {
      title: 'Stay Organized',
      description: 'Keep all your video summaries in one place with our dashboard.',
      icon: '📁'
    },
    {
      title: 'Find Anything',
      description: 'Jump to any section instantly with precise timestamp navigation.',
      icon: '🔍'
    },
    {
      title: 'Share Insights',
      description: 'Export and share summaries with your team or audience.',
      icon: '📤'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
                VideoSummarizer
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/signin">
                <Button 
                  size="sm"
                  className="bg-brand-gradient hover:opacity-90 text-white"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Get Started in
                <span className="block bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
                  3 Simple Steps
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform any video into actionable insights with our AI-powered summarization. 
                No technical knowledge required.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signin">
                <Button 
                  size="lg" 
                  className="bg-brand-gradient hover:opacity-90 text-white px-8 py-3 text-lg"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-3 text-lg border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered process makes video summarization effortless and accurate.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="p-8 glass-effect text-center h-full">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-brand-gradient rounded-full flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                      
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-8 w-8 text-brand-green-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose VideoSummarizer?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for professionals who need to extract maximum value from video content.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 glass-effect text-center">
                  <div className="space-y-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="p-12 glass-effect">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of professionals who save hours every week with AI-powered video summarization.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signin">
                    <Button 
                      size="lg" 
                      className="bg-brand-gradient hover:opacity-90 text-white px-8 py-3 text-lg"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-8 py-3 text-lg border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50"
                    >
                      View All Plans
                    </Button>
                  </Link>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  No credit card required • Cancel anytime • 5 free summaries included
                </p>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default GetStarted;
