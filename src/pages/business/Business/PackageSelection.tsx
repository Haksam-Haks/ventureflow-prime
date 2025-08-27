import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBusiness } from '../../../contexts/BusinessContext';
import { fetchBusinessCategories } from '../../../data/businessCategories';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle, ArrowLeft, Crown, Star, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { useUser } from '../../../contexts/UserContext';

interface PackageTier {
  id: 'basic' | 'premium' | 'gold';
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  listings: string;
  analytics: string;
  support: string;
  popular?: boolean;
  icon: React.ComponentType<any>;
  gradient: string;
}

const packages: PackageTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$29',
    period: 'per month',
    description: 'Perfect for getting started',
    listings: '3 listings',
    analytics: 'Basic analytics',
    support: 'Email support',
    features: [
      '3 active listings',
      'Basic profile customization',
      'Standard customer support',
      'Basic analytics dashboard',
      'Mobile-responsive listings'
    ],
    icon: Zap,
    gradient: 'from-egret-blue-light to-egret-blue-dark'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$79',
    period: 'per month',
    description: 'Most popular for growing businesses',
    listings: '15 listings',
    analytics: 'Advanced analytics',
    support: 'Priority support',
    popular: true,
    features: [
      '15 active listings',
      'Premium profile customization',
      'Priority customer support',
      'Advanced analytics & insights',
      'Featured listing placement',
      'Custom branding options',
      'Performance optimization'
    ],
    icon: Star,
    gradient: 'from-egret-blue-dark to-egret-green'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '$199',
    period: 'per month',
    description: 'Enterprise-level features',
    listings: 'Unlimited listings',
    analytics: 'Full analytics suite',
    support: '24/7 dedicated support',
    features: [
      'Unlimited active listings',
      'Full profile customization',
      '24/7 dedicated support manager',
      'Complete analytics suite',
      'Premium featured placement',
      'White-label branding',
      'API access & integrations',
      'Custom development support'
    ],
    icon: Crown,
    gradient: 'from-egret-green to-egret-blue-light'
  }
];

const PackageSelection = () => {
  const { user, isAuthenticated } = useUser();
  const { state, dispatch } = useBusiness();

  // Sync user context authentication to business context
  React.useEffect(() => {
    if (isAuthenticated && user && !state.isAuthenticated) {
      dispatch({ type: 'LOGIN', user });
    }
  }, [isAuthenticated, user, state.isAuthenticated, dispatch]);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();


  // State for categories
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch categories from backend
  React.useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchBusinessCategories();
        // Map backend fields to frontend model
        const mapped = response.map((cat: any) => ({
          id: cat.id,
          title: cat.name,
          description: cat.description || '',
          gradient: cat.gradient || 'from-primary to-secondary',
          subcategories: cat.subcategories || [],
        }));
        setCategories(mapped);
      } catch (err: any) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Always compare as string for id
  const businessTypeValue = state.user?.businessTypeId || categoryId;
  const category = categories.find((cat: any) => String(cat.id) === String(businessTypeValue));

  // Ensure category is set in state
  React.useEffect(() => {
    if (businessTypeValue && businessTypeValue !== state.selectedCategoryId) {
      dispatch({ type: 'SET_CATEGORY', categoryId: businessTypeValue });
    }
  }, [businessTypeValue, state.selectedCategoryId, dispatch]);


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-muted-foreground">Loading categories...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-red-500">{error}</div>;
  }
  if (!category) {
    // If missing, redirect to business dashboard for the current business type
    navigate(`/dashboard/${businessTypeValue}`);
    return null;
  }

  const handlePackageSelect = async (packageId: 'basic' | 'premium' | 'gold') => {
    const selectedPackage = packages.find(p => p.id === packageId);
    
    toast({
      title: "Processing...",
      description: "Setting up your subscription package",
    });

    // Simulate processing time
      setTimeout(() => {
        dispatch({ type: 'SET_PACKAGE', packageType: packageId });
        
        toast({
          title: "Welcome to VentureFlow Pro!",
          description: `Your ${selectedPackage?.name} package is now active. Your listing is live!`,
        });

        // Redirect to dashboard
        setTimeout(() => {
          navigate(`/dashboard/${businessTypeValue}`);
        }, 1500);
      }, 1000);
  };

  const handleBack = () => {
    // Go back to listing creation for the current business type
    navigate(`/dashboard/${businessTypeValue}/listing/new`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Gradient Header */}
      <header className="bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] shadow-lg rounded-b-2xl animate-fade-in">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="mr-2 bg-white/20 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Listing
          </Button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-md">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.gradient || 'from-[#0079C1] via-[#00AEEF] to-[#7ED321]'} flex items-center justify-center`}></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow">Choose Your Package</h1>
            <p className="text-md text-emerald-200 drop-shadow">Select the plan that fits your business needs</p>
          </div>
        </div>
      </header>

  <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl font-bold mb-4 text-[#0079C1]">Choose Your Success Plan</h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
            Unlock the full potential of your {category.title.toLowerCase()} business with our tailored packages
          </p>
          <Badge variant="secondary" className="mt-4 bg-[#00AEEF] text-white">
            🎉 30-day money-back guarantee
          </Badge>
        </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
           {packages.map((pkg: any, index: number) => {
             const IconComponent = pkg.icon;
             return (
              <Card 
                key={pkg.id}
                className={`relative border-2 border-white/30 bg-gradient-to-r from-[#f8fafc] to-[#e0f7fa] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in rounded-2xl shadow-md ${
                  pkg.popular 
                    ? 'border-[#00AEEF] ring-4 ring-[#00AEEF]/20' 
                    : 'hover:border-[#00AEEF]'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${pkg.gradient} p-4 shadow-lg`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-[#0079C1]">{pkg.name}</CardTitle>
                  <p className="text-emerald-700">{pkg.description}</p>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#0079C1]">{pkg.price}</span>
                    <span className="text-emerald-700 ml-2">{pkg.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-3 p-4 bg-white/70 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Listings:</span>
                      <span className="font-medium">{pkg.listings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Analytics:</span>
                      <span className="font-medium">{pkg.analytics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Support:</span>
                      <span className="font-medium">{pkg.support}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-[#0079C1] uppercase tracking-wide">
                      What's Included
                    </h4>
                     {pkg.features.map((feature: string, idx: number) => (
                       <div key={idx} className="flex items-start gap-3">
                         <CheckCircle className="w-5 h-5 text-[#00AEEF] mt-0.5 flex-shrink-0" />
                         <span className="text-sm text-foreground">{feature}</span>
                       </div>
                     ))}
                  </div>

                  <Button 
                    onClick={() => handlePackageSelect(pkg.id)}
                    variant={pkg.popular ? "default" : "outline"}
                    size="lg"
                    className={`w-full mt-6 font-bold rounded-lg shadow-md border-2 border-white ${pkg.popular ? 'bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white' : 'bg-gradient-to-r from-[#00AEEF] via-[#7ED321] to-[#0079C1] text-[#0079C1]'}`}
                  >
                    {pkg.popular ? 'Get Started Now' : 'Choose Plan'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
  <Card className="mt-16 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] animate-fade-in-delay shadow-lg rounded-2xl border-2 border-white/30">
          <CardHeader>
            <CardTitle className="text-center text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-white">Can I change my plan later?</h4>
              <p className="text-sm text-emerald-100">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-white">What happens to my listings if I downgrade?</h4>
              <p className="text-sm text-emerald-100">
                Your listings remain active, but you may need to deactivate some if you exceed the new limit.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-white">Is there a setup fee?</h4>
              <p className="text-sm text-emerald-100">
                No setup fees, no hidden costs. Just pay your monthly subscription and get started immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-white">Do you offer annual discounts?</h4>
              <p className="text-sm text-emerald-100">
                Yes! Contact our sales team for information about annual billing discounts up to 20%.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PackageSelection;