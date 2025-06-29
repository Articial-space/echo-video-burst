
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Check, Zap, Crown, Rocket } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      description: 'Perfect for individuals getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '5 video summaries per month',
        'Basic AI analysis',
        'Standard timestamps',
        'Email support',
        'Basic export options'
      ],
      popular: false,
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Professional',
      icon: Crown,
      description: 'For professionals and content creators',
      monthlyPrice: 19,
      annualPrice: 190,
      features: [
        '50 video summaries per month',
        'Advanced AI analysis',
        'Precise timestamps & sections',
        'Priority support',
        'Advanced export options',
        'Custom summaries',
        'Integration tools'
      ],
      popular: true,
      buttonText: 'Start Professional',
      buttonVariant: 'default' as const
    },
    {
      name: 'Enterprise',
      icon: Rocket,
      description: 'For teams and organizations',
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        'Unlimited video summaries',
        'Enterprise AI features',
        'Custom integrations',
        'Dedicated support',
        'Team collaboration',
        'Advanced analytics',
        'Custom branding',
        'API access'
      ],
      popular: false,
      buttonText: 'Start Enterprise',
      buttonVariant: 'outline' as const
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
                Choose Your
                <span className="block bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Start free and scale as you grow. All plans include our core AI-powered 
                video summarization features.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm ${!isAnnual ? 'text-brand-green-600 font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-12 h-6 p-0 ${isAnnual ? 'bg-brand-green-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute w-4 h-4 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </Button>
              <span className={`text-sm ${isAnnual ? 'text-brand-green-600 font-medium' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge variant="secondary" className="bg-brand-green-100 text-brand-green-700">
                  Save 17%
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 glass-effect ${plan.popular ? 'ring-2 ring-brand-green-400 scale-105' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-gradient text-white">
                    Most Popular
                  </Badge>
                )}
                
                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-brand-gradient rounded-full flex items-center justify-center">
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${Math.round(plan.annualPrice / 12)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-brand-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/signin">
                    <Button 
                      className={`w-full ${plan.buttonVariant === 'default' 
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
          <section className="mt-20 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our pricing plans.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                },
                {
                  question: "What video formats are supported?",
                  answer: "We support all major video formats including MP4, MOV, AVI, and more. You can also use YouTube URLs."
                },
                {
                  question: "Is there a free trial?",
                  answer: "Yes! Our Starter plan is completely free and includes 5 video summaries per month."
                },
                {
                  question: "How accurate are the AI summaries?",
                  answer: "Our AI achieves 95%+ accuracy using advanced language models trained specifically for video content."
                }
              ].map((faq, index) => (
                <Card key={index} className="p-6 glass-effect">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Pricing;
