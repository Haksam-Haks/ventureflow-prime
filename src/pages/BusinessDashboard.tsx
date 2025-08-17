import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Eye, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Building2,
  BarChart3,
  Settings
} from "lucide-react";

const BusinessDashboard = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Mock data based on category
  const categoryData = {
    accommodation: {
      title: "Accommodation Business",
      icon: Building2,
      color: "text-egret-blue-dark",
      subcategories: ["Hotel", "Lodge", "Resort", "B&B", "Hostel"]
    },
    food: {
      title: "Food & Beverage", 
      icon: Building2,
      color: "text-egret-green",
      subcategories: ["Restaurant", "Cafe", "Bar", "Fast Food", "Catering"]
    },
    activities: {
      title: "Activities & Tours",
      icon: Building2, 
      color: "text-egret-blue-light",
      subcategories: ["Adventure Tours", "Cultural Tours", "Water Sports", "Wildlife Safari"]
    }
  };

  const currentCategory = categoryData[categoryId as keyof typeof categoryData] || categoryData.accommodation;

  const stats = [
    { label: "Total Views", value: "12,453", icon: Eye, trend: "+12%" },
    { label: "Inquiries", value: "234", icon: MessageSquare, trend: "+8%" },
    { label: "Avg Rating", value: "4.8", icon: Star, trend: "+0.2" },
    { label: "Revenue", value: "$8,950", icon: TrendingUp, trend: "+15%" }
  ];

  const listings = [
    { id: 1, name: "Luxury Mountain Resort", category: "Resort", status: "Active", views: 1250, rating: 4.9 },
    { id: 2, name: "Downtown Business Hotel", category: "Hotel", status: "Active", views: 890, rating: 4.7 },
    { id: 3, name: "Beachfront Lodge", category: "Lodge", status: "Pending", views: 234, rating: 4.8 }
  ];

  const handleAddSubcategory = () => {
    navigate(`/dashboard/${categoryId}/subcategory`);
  };

  const handleAddListing = () => {
    navigate(`/dashboard/${categoryId}/listing/new`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar categoryId={categoryId} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <currentCategory.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{currentCategory.title}</h1>
                    <p className="text-muted-foreground">Manage your business listings</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="hero" onClick={handleAddSubcategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-card transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 text-success mr-1" />
                        <span className="text-success text-xs">{stat.trend}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>

            {/* Action Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="p-8 bg-gradient-primary/5 border-primary/20 hover:shadow-elegant transition-all duration-300 group cursor-pointer" onClick={handleAddSubcategory}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-card-foreground">Add New Listing</h3>
                    <p className="text-muted-foreground">Create a new business listing in your category</p>
                    <Button variant="hero" size="sm" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                  <Building2 className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
                </div>
              </Card>

              <Card className="p-8 bg-gradient-success/5 border-success/20 hover:shadow-success transition-all duration-300 group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-card-foreground">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">View detailed performance metrics and insights</p>
                    <Button variant="success" size="sm" className="mt-4">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                  <BarChart3 className="w-16 h-16 text-success/30 group-hover:text-success/50 transition-colors" />
                </div>
              </Card>
            </motion.div>

            {/* Active Listings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Active Listings</h2>
                <Button variant="outline" onClick={handleAddListing}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </div>
              
              <div className="grid gap-4">
                {listings.map((listing) => (
                  <Card key={listing.id} className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-card transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-card-foreground">{listing.name}</h3>
                          <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'}>
                            {listing.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{listing.category}</p>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{listing.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-muted-foreground">{listing.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BusinessDashboard;