import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Building2, 
  BarChart3, 
  Mail, 
  Phone, 
  Headphones,
  Crown,
  Zap
} from "lucide-react";

const PackageSelection = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingName = searchParams.get('listing') || 'Your Business';
  
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const packages = [
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: 29, yearly: 24 },
      description: 'Perfect for small businesses getting started',
      icon: Building2,
      color: 'border-border',
      buttonVariant: 'outline' as const,
      features: [
        '3 Active Listings',
        'Basic Analytics',
        'Email Support',
        'Standard Templates',
        'Basic SEO Tools'
      ],
      limitations: [
        'Limited customization',
        'Standard support response time'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 69, yearly: 55 },
      description: 'Most popular choice for growing businesses',
      icon: Star,
      color: 'border-primary shadow-elegant',
      buttonVariant: 'hero' as const,
      popular: true,
      features: [
        '15 Active Listings',
        'Advanced Analytics',
        'Priority Email Support',
        'Premium Templates',
        'Advanced SEO Tools',
        'Customer Inquiry Management',
        'Review Management',
        'Social Media Integration'
      ],
      limitations: []
    },
    {
      id: 'gold',
      name: 'Gold',
      price: { monthly: 149, yearly: 119 },
      description: 'Enterprise solution for large businesses',
      icon: Crown,
      color: 'border-egret-green shadow-success',
      buttonVariant: 'premium' as const,
      features: [
        'Unlimited Listings',
        'Full Analytics Suite',
        '24/7 Premium Support',
        'Custom Templates',
        'Enterprise SEO Tools',
        'Advanced CRM Integration',
        'API Access',
        'Dedicated Account Manager',
        'Custom Branding',
        'Multi-location Management'
      ],
      limitations: []
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handlePublish = () => {
    // Simulate publishing process
    navigate(`/dashboard/${categoryId}?published=${listingName}`);
  };

  const handleBack = () => {
    navigate(`/dashboard/${categoryId}/listing/new`);
  };

  const getDiscount = () => {
    switch (billingCycle) {
      case 'quarterly':
        return 10;
      case 'yearly':
        return 20;
      default:
        return 0;
    }
  };

  const calculatePrice = (price: number) => {
    const discount = getDiscount();
    return Math.round(price * (1 - discount / 100));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listing
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Choose Your Package</h1>
                <p className="text-sm text-muted-foreground">Select the plan that fits your business needs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6 border border-success/20">
              <Zap className="w-4 h-4 mr-2" />
              Almost Ready to Publish: {listingName}
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Subscription Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the package that best fits your business size and goals. You can upgrade or downgrade anytime.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center mb-12"
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center space-x-6">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <Switch 
                  checked={billingCycle !== 'monthly'}
                  onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <span className={`text-sm ${billingCycle === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-success text-success-foreground">
                    Save 20%
                  </Badge>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Package Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid lg:grid-cols-3 gap-8 mb-12"
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                <Card 
                  className={`p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm ${
                    pkg.color
                  } ${
                    selectedPackage === pkg.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:shadow-card'
                  }`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  )}

                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <pkg.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">{pkg.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-card-foreground">
                          ${calculatePrice(pkg.price[billingCycle as keyof typeof pkg.price])}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {getDiscount() > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="line-through">${pkg.price[billingCycle as keyof typeof pkg.price]}</span>
                          <span className="text-success ml-2">Save {getDiscount()}%</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-card-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant={selectedPackage === pkg.id ? 'hero' : pkg.buttonVariant}
                    className="w-full"
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : `Choose ${pkg.name}`}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Support Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="p-6 text-center bg-card/30 backdrop-blur-sm border-border">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-card-foreground mb-2">Email Support</h4>
              <p className="text-sm text-muted-foreground">Available in all plans</p>
            </Card>
            
            <Card className="p-6 text-center bg-card/30 backdrop-blur-sm border-border">
              <Phone className="w-8 h-8 text-success mx-auto mb-3" />
              <h4 className="font-semibold text-card-foreground mb-2">Priority Support</h4>
              <p className="text-sm text-muted-foreground">Premium & Gold plans</p>
            </Card>
            
            <Card className="p-6 text-center bg-card/30 backdrop-blur-sm border-border">
              <Headphones className="w-8 h-8 text-accent mx-auto mb-3" />
              <h4 className="font-semibold text-card-foreground mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">Gold plan only</p>
            </Card>
          </motion.div>

          {/* Action Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card className="p-8 bg-gradient-primary/5 border-primary/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                Ready to Publish Your Listing?
              </h3>
              <p className="text-muted-foreground mb-6">
                Your listing "{listingName}" is ready to go live. Choose your package and start attracting customers today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={handleBack}>
                  Review Listing
                </Button>
                <Button variant="hero" size="lg" onClick={handlePublish}>
                  <Zap className="w-4 h-4 mr-2" />
                  Publish & Subscribe
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                30-day money-back guarantee • Cancel anytime • No setup fees
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PackageSelection;