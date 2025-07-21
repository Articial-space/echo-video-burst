
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Play, Download, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const GetStarted = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Video",
      description: "Drag and drop your video file or paste a YouTube/Vimeo URL. We support all major video formats.",
      tip: "Videos up to 2 hours work best for detailed analysis."
    },
    {
      icon: Play,
      title: "AI Analysis",
      description: "Our advanced AI processes your video, extracting key insights and creating precise timestamps.",
      tip: "Analysis typically takes 30-60 seconds depending on length."
    },
    {
      icon: Download,
      title: "Get Your Summary",
      description: "Receive comprehensive summaries with section breakdowns and clickable timestamps.",
      tip: "Export to PDF, Word, or share via link."
    }
  ];

  const useCases = [
    {
      title: "Educational Content",
      description: "Quickly review lectures and tutorials",
      examples: ["University lectures", "Online courses", "Training videos"]
    },
    {
      title: "Business Meetings", 
      description: "Extract action items and decisions",
      examples: ["Team meetings", "Client calls", "Webinars"]
    },
    {
      title: "Content Research",
      description: "Research for content creation",
      examples: ["YouTube research", "Market analysis", "Trend spotting"]
    },
    {
      title: "Personal Learning",
      description: "Make the most of podcasts and documentaries",
      examples: ["Podcasts", "Documentaries", "Expert interviews"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
              <span className="block mb-2 text-foreground/90">Get Started with</span>
              <span className="block brand-text-gradient hover-scale transition-transform duration-300">
                Viel
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any video into actionable insights in three simple steps. No technical expertise required.
            </p>
            <Link to="/signin">
              <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white">
                Start Free Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Steps Section */}
          <section className="mb-16 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-8 animate-fade-in">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  <Card className="p-6 glass-effect border-0 h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in hover-scale" style={{ animationDelay: `${index * 200}ms` }}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <step.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-brand-green-100 flex items-center justify-center animate-pulse">
                          <span className="text-brand-green-600 text-sm font-bold">{index + 1}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold group-hover:text-brand-green-600 transition-colors duration-300">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                        <div className="p-3 bg-brand-green-50 rounded-lg group-hover:bg-brand-green-100 transition-colors duration-300">
                          <p className="text-brand-green-700 text-sm font-medium">{step.tip}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 animate-bounce">
                      <ArrowRight className="h-5 w-5 text-brand-green-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Perfect For Any Use Case</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're a student, professional, or content creator, Viel adapts to your needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-5 glass-effect border-0 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold">{useCase.title}</h3>
                    <p className="text-muted-foreground text-sm">{useCase.description}</p>
                    <div className="space-y-1">
                      {useCase.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-brand-green-500" />
                          <span className="text-xs text-muted-foreground">{example}</span>
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
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Ready to Transform Your Videos?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Join thousands of users who save hours every week with intelligent video summaries.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
