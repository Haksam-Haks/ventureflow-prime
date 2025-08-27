import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { fetchBusinessCategories, BusinessCategory } from '../../../data/businessCategories';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { 
  Plus, 
  BarChart3, 
  Star, 
  TrendingUp, 
  ArrowLeft,
  ArrowRight,
  Building,
  Calendar,
  MessageCircle
} from 'lucide-react';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const businessContext = useBusiness();
  const { user, isAuthenticated } = useUser();

  // Sync user context authentication to business context
  React.useEffect(() => {
    if (isAuthenticated && user && !businessContext.state.isAuthenticated) {
      businessContext.dispatch({ type: 'LOGIN', user });
    }
  }, [isAuthenticated, user, businessContext.state.isAuthenticated, businessContext.dispatch]);
  // Get businessTypeId from route params if available
  const { categoryId } = useParams();
  const location = useLocation();
  const businessTypeId = categoryId || businessContext.selectedCategoryId;
  const [categories, setCategories] = React.useState<BusinessCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  // Always compare as string for id
  const category = categories.find((cat: any) => String(cat.id) === String(businessTypeId));

  React.useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const response = await fetchBusinessCategories();
        // Accepts either response.data or response.returnObject or array
        let raw = Array.isArray(response)
          ? response
          : (typeof response === 'object' && response !== null)
            ? ('data' in response ? (response as any).data : ('returnObject' in response ? (response as any).returnObject : []))
            : [];
        // Map backend fields to frontend model
        const mapped = raw.map((cat: any) => ({
          id: String(cat.id),
          title: cat.name,
          description: cat.description || '',
          gradient: cat.gradient || 'from-primary to-secondary',
          subcategories: cat.subcategories || [],
        }));
        setCategories(mapped);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  React.useEffect(() => {
    // Only redirect to home if on the main dashboard route, not subpages like /subcategory
    const isMainDashboard = /^\/dashboard\/[\w-]+$/.test(location.pathname);
    if (!loading && (!businessTypeId || !category) && isMainDashboard) {
      navigate('/'); // fallback to home if no valid categoryId
    }
  }, [businessTypeId, category, navigate, loading, location.pathname]);

  const handleAddListing = () => {
    if (businessTypeId) {
      // Always set the selected category in context before navigating
      businessContext.dispatch({ type: 'SET_CATEGORY', categoryId: businessTypeId });
      navigate(`/dashboard/${businessTypeId}/subcategory`);
    } else {
      navigate('/'); // fallback to home if no valid categoryId
    }
  }

  const handleBackToDashboard = () => {
    navigate('/');
  };

  // Stats and activity should be fetched from backend or context in production
  const stats = React.useMemo(() => ({
    views: 0,
    inquiries: 0,
    rating: 0,
    listings: 0
  }), [category]);

  const recentActivity: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Gradient Header */}
      <header className="bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] shadow-lg rounded-b-2xl animate-fade-in">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToDashboard}
              className="mr-2 bg-white/20 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-md">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category?.gradient ?? 'from-[#0079C1] via-[#00AEEF] to-[#7ED321]'} flex items-center justify-center`}></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow">{category?.title ?? ''} Dashboard</h1>
              <p className="text-md text-emerald-200 drop-shadow">{category?.description ?? ''}</p>
            </div>
          </div>
          <Button 
            onClick={handleAddListing} 
            className="px-8 py-3 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 border-2 border-white"
            style={{ fontSize: '1.1rem' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Listing
          </Button>
        </div>
      </header>

  <main className="container mx-auto px-4 py-12">
        {/* Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="animate-fade-in shadow-lg rounded-2xl bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{typeof stats.views === 'number' && stats.views > 0 ? stats.views : '--'}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-success mr-1" />
                <span className="text-xs text-success">&nbsp;</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in shadow-lg rounded-2xl bg-white/90" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inquiries</p>
                  <p className="text-2xl font-bold">{typeof stats.inquiries === 'number' && stats.inquiries > 0 ? stats.inquiries : '--'}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 text-success mr-1" />
                <span className="text-xs text-success">&nbsp;</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in shadow-lg rounded-2xl bg-white/90" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">{typeof stats.rating === 'number' && stats.rating > 0 ? stats.rating : '--'}</p>
                </div>
                <Star className="w-8 h-8 text-warning fill-warning" />
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground">&nbsp;</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in shadow-lg rounded-2xl bg-white/90" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                  <p className="text-2xl font-bold">{typeof stats.listings === 'number' && stats.listings > 0 ? stats.listings : '--'}</p>
                </div>
                <Building className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground">&nbsp;</span>
              </div>
            </CardContent>
          </Card>
        </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="animate-slide-up shadow-xl rounded-2xl bg-background/90 border border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-between h-16 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white font-bold rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-white"
                  onClick={handleAddListing}
                >
                  <div className="text-left">
                    <p className="font-medium">Create New Listing</p>
                    <p className="text-sm text-emerald-700">Add a new {category?.title?.toLowerCase() ?? 'accommodation'} to your portfolio</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button 
                  className="w-full justify-between h-16 bg-gradient-to-r from-[#00AEEF] via-[#7ED321] to-[#0079C1] text-white font-bold rounded-lg shadow-md hover:scale-105 transition-all duration-200 border-2 border-white"
                  onClick={() => {
                    if (businessTypeId) {
                      businessContext.dispatch({ type: 'SET_CATEGORY', categoryId: businessTypeId });
                      navigate(`/dashboard/${businessTypeId}/subcategory`);
                    } else {
                      navigate('/'); // fallback to home if no valid categoryId
                    }
                  }}
                >
                  <div className="text-left">
                    <p className="font-medium">Browse Subcategories</p>
                    <p className="text-sm text-emerald-700">Explore different types of {category?.title?.toLowerCase() ?? 'accommodation'} and Add Listing</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-between h-16 bg-white/70 text-foreground border border-white/30 rounded-lg"
                  disabled
                >
                  <div className="text-left">
                    <p className="font-medium">Analytics Dashboard</p>
                    <p className="text-sm text-muted-foreground">View detailed performance metrics</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* Subcategories Preview */}
            <Card className="mt-6 animate-fade-in-delay shadow-lg rounded-2xl bg-white/90 border border-white/30">
              <CardHeader>
                <CardTitle>Available Subcategories</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose from {category?.subcategories?.length ?? 0} specialized {category?.title?.toLowerCase() ?? ''} types
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category?.subcategories?.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No subcategories available for this business type.</div>
                    ) : (
                      category?.subcategories?.map((subcategory: any) => (
                        <div key={subcategory.id} className="p-4 border rounded-lg hover:border-[#00AEEF] border-white/30 bg-gradient-to-r from-[#f8fafc] to-[#e0f7fa] transition-colors cursor-pointer group shadow-sm">
                          <h4 className="font-medium group-hover:text-[#0079C1] transition-colors">{subcategory.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{subcategory.description}</p>
                          <Badge variant="secondary" className="mt-2 text-xs bg-[#00AEEF] text-white">
                            {subcategory.fields.length} custom fields
                          </Badge>
                        </div>
                      ))
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="animate-slide-up shadow-lg rounded-2xl bg-white/90 border border-white/30" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No recent activity yet. Your business activity will appear here once you start receiving views, inquiries, or ratings.</div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={activity.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'inquiry' ? 'bg-accent' :
                          activity.type === 'view' ? 'bg-primary' :
                          'bg-success'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      {index < recentActivity.length - 1 && <Separator />}
                    </div>
                  ))
                )}
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Activity
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;