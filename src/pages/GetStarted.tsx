
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Link as LinkIcon, Play, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GetStarted = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Video",
      description: "Drag and drop your video file or paste a YouTube/Vimeo URL. We support all major video formats.",
      tip: "Pro tip: Videos up to 2 hours work best for detailed analysis."
    },
    {
      icon: Play,
      title: "AI Analysis Begins",
      description: "Our advanced AI processes your video, extracting key insights, themes, and creating precise timestamps.",
      tip: "Analysis typically takes 30-60 seconds depending on video length."
    },
    {
      icon: Download,
      title: "Get Your Summary",
      description: "Receive a comprehensive summary with section breakdowns, key points, and clickable timestamps.",
      tip: "Export your summaries to PDF, Word, or share via link."
    }
  ];

  const useCases = [
    {
      title: "Educational Content",
      description: "Quickly review lectures, tutorials, and online courses",
      examples: ["University lectures", "Online courses", "Training videos"]
    },
    {
      title: "Business Meetings", 
      description: "Extract action items and key decisions from recorded meetings",
      examples: ["Team meetings", "Client calls", "Webinars"]
    },
    {
      title: "Content Research",
      description: "Research videos for content creation and competitive analysis", 
      examples: ["YouTube research", "Market analysis", "Trend spotting"]
    },
    {
      title: "Personal Learning",
      description: "Make the most of podcasts, documentaries, and interviews",
      examples: ["Podcasts", "Documentaries", "Expert interviews"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Get Started with
              <span className="block bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
                VideoSummarizer
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any video into actionable insights in just three simple steps. No technical expertise required.
            </p>
            <Link to="/signin">
              <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white">
                Start Free Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Steps Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="p-8 glass-effect border-0 h-full">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center">
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-green-100 flex items-center justify-center">
                          <span className="text-brand-green-600 text-sm font-bold">{index + 1}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                        <div className="p-3 bg-brand-green-50 rounded-lg">
                          <p className="text-brand-green-700 text-sm font-medium">{step.tip}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-brand-green-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Perfect For Any Use Case</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're a student, professional, or content creator, VideoSummarizer adapts to your needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-6 glass-effect border-0 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{useCase.title}</h3>
                    <p className="text-muted-foreground text-sm">{useCase.description}</p>
                    <div className="space-y-2">
                      {useCase.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-brand-green-500"></div>
                          <span className="text-sm text-muted-foreground">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="p-8 glass-effect border-0">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Ready to Transform Your Videos?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Join thousands of users who save hours every week with intelligent video summaries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button size="lg" className="bg-brand-gradient hover:opacity-90">
                      Try It Now - Free
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" size="lg" className="border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default GetStarted;
