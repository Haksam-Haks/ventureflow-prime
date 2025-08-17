import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BusinessDashboard from "./pages/BusinessDashboard";
import SubcategorySelection from "./pages/SubcategorySelection";
import ListingCreation from "./pages/ListingCreation";
import PackageSelection from "./pages/PackageSelection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard/:categoryId" element={<BusinessDashboard />} />
          <Route path="/dashboard/:categoryId/subcategory" element={<SubcategorySelection />} />
          <Route path="/dashboard/:categoryId/listing/new" element={<ListingCreation />} />
          <Route path="/dashboard/:categoryId/package" element={<PackageSelection />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;