import { Share, BarChart3, Calendar, FolderOpen, Layers, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCreatePost: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "calendar", label: "Content Calendar", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "library", label: "Content Library", icon: FolderOpen },
  { id: "templates", label: "Templates", icon: Layers },
];

export default function Sidebar({ activeView, onViewChange, onCreatePost }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Share className="text-white text-sm" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">SocialFlow</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all",
              activeView === item.id
                ? "bg-blue-50 text-primary border-r-2 border-primary"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-700"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div className="pt-6 border-t border-gray-200 mt-6">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-700 transition-all">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Quick Create Button */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          onClick={onCreatePost}
          className="w-full bg-primary text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>
    </div>
  );
}
