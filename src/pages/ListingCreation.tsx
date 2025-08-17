import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Building2, Upload, MapPin, Phone, Mail, Globe } from "lucide-react";

const ListingCreation = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get('subcategory') || 'hotel';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    amenities: [],
    images: []
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Dynamic fields based on subcategory
  const subcategoryFields = {
    hotel: {
      name: "Hotel",
      fields: [
        { key: "rooms", label: "Number of Rooms", type: "number", placeholder: "50" },
        { key: "checkIn", label: "Check-in Time", type: "time", placeholder: "15:00" },
        { key: "checkOut", label: "Check-out Time", type: "time", placeholder: "11:00" },
        { key: "starRating", label: "Star Rating", type: "select", options: ["1", "2", "3", "4", "5"] }
      ],
      amenities: ["WiFi", "Parking", "Restaurant", "Gym", "Pool", "Spa", "Room Service", "Concierge"]
    },
    lodge: {
      name: "Lodge",
      fields: [
        { key: "cabins", label: "Number of Cabins", type: "number", placeholder: "12" },
        { key: "capacity", label: "Total Capacity", type: "number", placeholder: "24" },
        { key: "season", label: "Operating Season", type: "text", placeholder: "Year-round" },
        { key: "activities", label: "Main Activities", type: "text", placeholder: "Hiking, Fishing" }
      ],
      amenities: ["Fireplace", "Kitchen", "Hiking Trails", "WiFi", "Parking", "Restaurant", "Nature Guides"]
    },
    resort: {
      name: "Resort",  
      fields: [
        { key: "rooms", label: "Number of Rooms", type: "number", placeholder: "200" },
        { key: "restaurants", label: "Number of Restaurants", type: "number", placeholder: "3" },
        { key: "pools", label: "Number of Pools", type: "number", placeholder: "2" },
        { key: "beachfront", label: "Beachfront Access", type: "select", options: ["Yes", "No"] }
      ],
      amenities: ["All-Inclusive", "Multiple Restaurants", "Spa", "Pool", "Beach Access", "Golf Course", "Entertainment", "Kids Club"]
    }
  };

  const currentSubcategory = subcategoryFields[subcategory as keyof typeof subcategoryFields] || subcategoryFields.hotel;

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to package selection
      navigate(`/dashboard/${categoryId}/package?listing=${formData.name}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(`/dashboard/${categoryId}/subcategory`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Basic Information</h3>
              <p className="text-muted-foreground mb-6">Tell us about your {currentSubcategory.name.toLowerCase()}</p>
            </div>

            <div className="grid gap-6">
              <div>
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your business name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your business and what makes it special"
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your business address"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Contact & Details</h3>
              <p className="text-muted-foreground mb-6">Add contact information and {currentSubcategory.name.toLowerCase()}-specific details</p>
            </div>

            <div className="grid gap-6">
              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@yourbusiness.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="relative mt-2">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.yourbusiness.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Dynamic Fields */}
              <div>
                <h4 className="font-medium text-foreground mb-4">{currentSubcategory.name} Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentSubcategory.fields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Amenities & Images</h3>
              <p className="text-muted-foreground mb-6">Select amenities and upload photos to showcase your business</p>
            </div>

            <div className="space-y-8">
              {/* Amenities Selection */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Available Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {currentSubcategory.amenities.map((amenity) => (
                    <Badge 
                      key={amenity}
                      variant="outline"
                      className="justify-center p-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Photos</h4>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h5 className="font-medium text-foreground mb-2">Upload Photos</h5>
                  <p className="text-muted-foreground text-sm mb-4">
                    Drag and drop your images here, or click to browse
                  </p>
                  <Button variant="outline">Choose Files</Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Create New Listing</h1>
                  <p className="text-sm text-muted-foreground">{currentSubcategory.name} • Step {currentStep} of {totalSteps}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-4">
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border shadow-card">
            {renderStep()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button 
                variant="hero" 
                onClick={handleNext}
                disabled={!formData.name || !formData.description}
              >
                {currentStep === totalSteps ? 'Complete' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ListingCreation;