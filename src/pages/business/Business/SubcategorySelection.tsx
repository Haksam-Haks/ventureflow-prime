import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { fetchBusinessCategories } from '../../../data/businessCategories';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';

const SubcategorySelection = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useBusiness();
  const { user, isAuthenticated } = useUser();


  // All hooks at the top
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingSubcategory, setPendingSubcategory] = React.useState<string | null>(null);

  // Always compare as string for id
  const businessTypeValue = state.user?.businessTypeId || state.selectedCategoryId;
  const category = categories.find((cat: any) => String(cat.id) === String(businessTypeValue));

  React.useEffect(() => {
    if (isAuthenticated && user && !state.isAuthenticated) {
      dispatch({ type: 'LOGIN', user });
    }
  }, [isAuthenticated, user, state.isAuthenticated, dispatch]);

  React.useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const response: any = await fetchBusinessCategories();
        let raw = Array.isArray(response)
          ? response
          : (typeof response === 'object' && response !== null)
            ? ('data' in response ? response.data : ('returnObject' in response ? response.returnObject : []))
            : [];
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
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  React.useEffect(() => {
    // Only redirect to dashboard if on the main subcategory route, not subpages
    const isMainSubcategory = /^\/dashboard\/[\w-]+\/subcategory$/.test(window.location.pathname);
    if (!loading && (!businessTypeValue || !category) && isMainSubcategory) {
      navigate('/'); // fallback to home if no valid categoryId
    }
  }, [businessTypeValue, category, navigate, loading]);

  // Only one useEffect for subcategory navigation should exist


  let content: React.ReactNode = null;
  if (loading) {
    content = <div className="min-h-screen flex items-center justify-center text-lg text-muted-foreground">Loading categories...</div>;
  } else if (error) {
    content = <div className="min-h-screen flex items-center justify-center text-lg text-red-500">{error}</div>;
  } else if (!category) {
    content = null;
  }

  // (moved to top)
  const handleSubcategorySelect = (subcategoryId: string) => {
    setPendingSubcategory(subcategoryId);
    dispatch({ type: 'SET_SUBCATEGORY', subcategoryId });
  };

  React.useEffect(() => {
    if (
      state.selectedSubcategoryId &&
      pendingSubcategory &&
      state.selectedSubcategoryId === pendingSubcategory &&
      businessTypeValue
    ) {
      navigate(`/dashboard/${businessTypeValue}/listing/new`);
      setPendingSubcategory(null); // Reset after navigation to prevent repeated navigation
    }
  }, [state.selectedSubcategoryId, businessTypeValue, navigate, pendingSubcategory]);

  const handleBack = () => {
    // Go back to business dashboard for the current business type
    navigate(`/dashboard/${businessTypeValue}`);
  };


  if (content) return content;

  // Only render the main UI if not loading, not error, and category exists
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
            Back
          </Button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-md">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.gradient || 'from-[#0079C1] via-[#00AEEF] to-[#7ED321]'} flex items-center justify-center`}></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow">Choose {category.title} Type</h1>
            <p className="text-md text-emerald-200 drop-shadow">Select the specific type of {category.title.toLowerCase()} you want to list</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up text-center">
          <h2 className="text-3xl font-bold mb-2 text-[#0079C1]">Select Subcategory</h2>
          <p className="text-emerald-700">
            Each subcategory has specialized fields tailored to your specific business type.
          </p>
        </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {category.subcategories.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">No subcategories available for this business type. Please contact support or select a different category.</div>
            ) : (
              category.subcategories.map((subcategory: any, index: number) => (
                <Card 
                  key={subcategory.id}
                  className="group cursor-pointer border-2 border-white/30 hover:border-[#00AEEF] bg-gradient-to-r from-[#f8fafc] to-[#e0f7fa] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in rounded-2xl shadow-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleSubcategorySelect(subcategory.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-6 h-6 text-[#0079C1]" />
                      <Badge variant="secondary" className="text-xs bg-[#00AEEF] text-white">
                        {subcategory.fields.length} fields
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-[#0079C1] transition-colors">
                      {subcategory.title}
                    </CardTitle>
                    <p className="text-sm text-emerald-700">
                      {subcategory.description}
                    </p>
                  </CardHeader>
                
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <p className="text-sm font-medium text-muted-foreground">Form includes:</p>
                      <div className="space-y-2">
                        {subcategory.fields.slice(0, 4).map((field: any) => (
                          <div key={field.id} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{field.label}</span>
                            <Badge 
                              variant={field.required ? "destructive" : "secondary"} 
                              className="text-xs"
                            >
                              {field.required ? 'Required' : 'Optional'}
                            </Badge>
                          </div>
                        ))}
                        {subcategory.fields.length > 4 && (
                          <p className="text-xs text-muted-foreground">
                            +{subcategory.fields.length - 4} more fields...
                          </p>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white font-bold rounded-lg shadow-md group-hover:scale-105 transition-all border-2 border-white"
                      onClick={e => {
                        e.stopPropagation();
                        handleSubcategorySelect(subcategory.id);
                      }}
                    >
                      Create {subcategory.title}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
        </div>

        {/* Help Section */}
  <Card className="mt-12 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] animate-fade-in-delay shadow-lg rounded-2xl border-2 border-white/30">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-white">Need Help Choosing?</h3>
              <p className="text-emerald-100 mb-4">
                Each subcategory is designed with specific fields and features for different types of {category.title.toLowerCase()}.
                You can always create multiple listings for different subcategories.
              </p>
              <Button variant="outline" size="sm" className="bg-white/20 text-white border-white">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SubcategorySelection;