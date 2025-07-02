
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out VideoSummarizer",
      features: [
        "3 video summaries per month",
        "Basic AI analysis",
        "Standard timestamps",
        "Email support"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Best for regular users and content creators",
      features: [
        "50 video summaries per month",
        "Advanced AI analysis",
        "Detailed section breakdowns",
        "Priority timestamps",
        "Video history storage",
        "Export summaries (PDF, Word)",
        "Priority support",
        "Custom templates"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For teams and organizations",
      features: [
        "Unlimited video summaries",
        "Premium AI analysis",
        "Custom analysis templates",
        "Team collaboration tools",
        "API access",
        "Custom integrations",
        "Advanced analytics dashboard",
        "Dedicated account manager",
        "24/7 priority support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include core AI-powered video analysis.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-6 glass-effect border-0 ${
                  plan.popular 
                    ? 'ring-2 ring-brand-green-500 scale-105 shadow-xl' 
                    : 'hover:shadow-lg'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-brand-gradient text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">/{plan.period}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-brand-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/signin" className="block">
                    <Button 
                      className={`w-full ${
                        plan.buttonVariant === 'default' 
                          ? 'bg-brand-gradient hover:opacity-90 text-white' 
                          : 'border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50'
                      }`}
                      variant={plan.buttonVariant}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
              <div className="space-y-2">
                <h3 className="font-semibold">Can I change plans anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, upgrade or downgrade anytime. Changes take effect immediately with prorated billing.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">What video formats are supported?</h3>
                <p className="text-muted-foreground text-sm">
                  All major formats including MP4, MOV, AVI, plus direct URLs from YouTube, Vimeo, and more.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Start with our Free plan or try Pro with a 7-day free trial. No credit card required.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">How accurate are the summaries?</h3>
                <p className="text-muted-foreground text-sm">
                  Our AI achieves 95%+ accuracy by analyzing both audio and visual context for comprehensive summaries.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pricing;
