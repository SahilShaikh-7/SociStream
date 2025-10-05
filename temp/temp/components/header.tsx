import { Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
            alt="User Profile" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">sahil shaikh</span>
        </div>
      </div>
    </header>
  );
}
