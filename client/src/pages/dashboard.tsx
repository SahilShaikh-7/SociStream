import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StatsCards from "@/components/dashboard/stats-cards";
import Charts from "@/components/dashboard/charts";
import RecentPosts from "@/components/dashboard/recent-posts";
import ContentCalendar from "@/components/calendar/content-calendar";
import AnalyticsOverview from "@/components/analytics/analytics-overview";
import ContentLibrary from "@/components/library/content-library";
import TemplateGallery from "@/components/templates/template-gallery";
import SettingsPage from "@/components/settings/settings-page";
import CreatePostModal from "@/components/modals/create-post-modal";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="p-6">
            <StatsCards />
            <Charts />
            <RecentPosts />
          </div>
        );
      case "calendar":
        return <ContentCalendar />;
      case "analytics":
        return <AnalyticsOverview />;
      case "library":
        return <ContentLibrary />;
      case "templates":
        return <TemplateGallery />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="p-6">
            <StatsCards />
            <Charts />
            <RecentPosts />
          </div>
        );
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      calendar: "Content Calendar",
      analytics: "Analytics",
      library: "Content Library",
      templates: "Post Templates",
      settings: "Settings"
    };
    return titles[activeView as keyof typeof titles] || "Dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onCreatePost={() => setIsCreateModalOpen(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderActiveView()}
        </main>
        <Footer />
      </div>
      
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
