import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Users, Star } from "lucide-react";

const SubcategorySelection = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const subcategoryData = {
    accommodation: [
      { 
        id: "hotel", 
        name: "Hotel", 
        description: "Full-service accommodations with professional staff",
        icon: "🏨",
        features: ["Room Service", "Concierge", "Business Center"],
        popular: true
      },
      { 
        id: "lodge", 
        name: "Lodge", 
        description: "Rustic accommodations often in natural settings",
        icon: "🏔️",
        features: ["Nature Access", "Outdoor Activities", "Cozy Atmosphere"],
        popular: false
      },
      { 
        id: "resort", 
        name: "Resort", 
        description: "All-inclusive vacation destinations with amenities",
        icon: "🏖️",
        features: ["Multiple Restaurants", "Spa Services", "Recreation"],
        popular: true
      },
      { 
        id: "bnb", 
        name: "Bed & Breakfast", 
        description: "Intimate accommodations with personal touch",
        icon: "🏡",
        features: ["Home Cooked Meals", "Personal Service", "Local Experience"],
        popular: false
      },
      { 
        id: "hostel", 
        name: "Hostel", 
        description: "Budget-friendly shared accommodations",
        icon: "🎒",
        features: ["Shared Spaces", "Budget Friendly", "Social Environment"],
        popular: false
      }
    ],
    food: [
      { 
        id: "restaurant", 
        name: "Restaurant", 
        description: "Full-service dining establishments",
        icon: "🍽️",
        features: ["Table Service", "Full Menu", "Professional Kitchen"],
        popular: true
      },
      { 
        id: "cafe", 
        name: "Cafe", 
        description: "Casual dining with coffee and light meals",
        icon: "☕",
        features: ["Coffee Specialties", "Light Meals", "Casual Atmosphere"],
        popular: true
      },
      { 
        id: "bar", 
        name: "Bar", 
        description: "Beverage-focused venues with entertainment",
        icon: "🍺",
        features: ["Craft Cocktails", "Entertainment", "Social Scene"],
        popular: false
      }
    ],
    activities: [
      { 
        id: "adventure", 
        name: "Adventure Tours", 
        description: "Thrilling outdoor experiences and expeditions",
        icon: "🏔️",
        features: ["Outdoor Adventures", "Professional Guides", "Safety Equipment"],
        popular: true
      },
      { 
        id: "cultural", 
        name: "Cultural Tours", 
        description: "Immersive local culture and heritage experiences",
        icon: "🏛️",
        features: ["Local History", "Cultural Insights", "Expert Guides"],
        popular: false
      },
      { 
        id: "wildlife", 
        name: "Wildlife Safari", 
        description: "Nature and wildlife observation experiences",
        icon: "🦁",
        features: ["Wildlife Viewing", "Nature Photography", "Conservation Focus"],
        popular: true
      }
    ]
  };

  const currentSubcategories = subcategoryData[categoryId as keyof typeof subcategoryData] || subcategoryData.accommodation;

  const handleSelectSubcategory = (subcategoryId: string) => {
    navigate(`/dashboard/${categoryId}/listing/new?subcategory=${subcategoryId}`);
  };

  const handleBack = () => {
    navigate(`/dashboard/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Select Subcategory</h1>
                <p className="text-sm text-muted-foreground">Choose the type of listing you want to create</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Business Type
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the category that best describes your business to create a tailored listing with relevant fields and features.
            </p>
          </div>

          {/* Subcategory Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm group relative overflow-hidden"
                  onClick={() => handleSelectSubcategory(subcategory.id)}
                >
                  {subcategory.popular && (
                    <Badge className="absolute top-4 right-4 bg-gradient-primary text-white border-0">
                      Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">{subcategory.icon}</div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                      {subcategory.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {subcategory.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {subcategory.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Select {subcategory.name}
                  </Button>

                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Help Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Card className="p-8 bg-gradient-primary/5 border-primary/20 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                Need Help Choosing?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our team can help you select the best category for your business and optimize your listing for maximum visibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="ghost">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Examples
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default SubcategorySelection;