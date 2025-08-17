import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Building2,
  BarChart3,
  Settings,
  Plus,
  Users,
  MessageSquare,
  Star,
  CreditCard
} from "lucide-react";

interface AppSidebarProps {
  categoryId?: string;
}

export function AppSidebar({ categoryId = "accommodation" }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const mainItems = [
    { title: "Dashboard", url: `/dashboard/${categoryId}`, icon: Home },
    { title: "Analytics", url: `/dashboard/${categoryId}/analytics`, icon: BarChart3 },
    { title: "Listings", url: `/dashboard/${categoryId}/listings`, icon: Building2 },
    { title: "Inquiries", url: `/dashboard/${categoryId}/inquiries`, icon: MessageSquare },
    { title: "Reviews", url: `/dashboard/${categoryId}/reviews`, icon: Star },
  ];

  const managementItems = [
    { title: "Customers", url: `/dashboard/${categoryId}/customers`, icon: Users },
    { title: "Packages", url: `/dashboard/${categoryId}/package`, icon: CreditCard },
    { title: "Settings", url: `/dashboard/${categoryId}/settings`, icon: Settings },
  ];

  const isActive = (path: string) => currentPath === path;
  const isMainGroupExpanded = mainItems.some((item) => isActive(item.url));
  const isManagementGroupExpanded = managementItems.some((item) => isActive(item.url));

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-sidebar-background">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">VentureFlow</h2>
                <p className="text-xs text-sidebar-foreground/60">Pro Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action */}
        {!collapsed && (
          <div className="p-4">
            <NavLink to={`/dashboard/${categoryId}/subcategory`}>
              <div className="flex items-center space-x-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg p-3 hover:bg-sidebar-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Listing</span>
              </div>
            </NavLink>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClassName}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClassName}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Package Info */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="bg-sidebar-accent/30 rounded-lg p-3 text-center">
              <p className="text-xs text-sidebar-foreground/80 mb-1">Current Package</p>
              <p className="text-sm font-medium text-sidebar-foreground">Premium Plan</p>
              <p className="text-xs text-sidebar-foreground/60">15/15 listings used</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}