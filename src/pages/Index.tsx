import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, TrendingUp, Users, Shield, Star, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [selectedBusinessType] = useState("accommodation"); // Mock user business type

  const handleAddBusinessUnit = () => {
    // Simulate retrieving businessTypeId from user profile
    navigate(`/dashboard/${selectedBusinessType}`);
  };

  const features = [
    {
      icon: Building2,
      title: "Multi-Category Support",
      description: "Accommodation, Food & Beverage, Activities, and more"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track views, inquiries, and performance metrics"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Manage inquiries and customer relationships"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and 99.9% uptime"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VentureFlow</h1>
                <p className="text-xs text-muted-foreground">Pro</p>
              </div>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Button variant="outline" size="sm">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-gradient-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Star className="w-4 h-4 mr-2" />
              #1 Business Listing Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Grow Your Business
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Exponentially
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Create stunning business listings, manage multiple categories, and track performance with our comprehensive platform designed for modern enterprises.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={handleAddBusinessUnit}
                className="group"
              >
                Add Business Unit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            id="features"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-card"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Active Businesses</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-success mb-2">95%</div>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <p className="text-muted-foreground">Premium Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 VentureFlow Pro. Built for modern businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;