import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

const platformIcons = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  linkedin: SiLinkedin,
  twitter: SiX,
};

const platformColors = {
  facebook: "bg-blue-100 text-blue-800",
  instagram: "bg-pink-100 text-pink-800",
  linkedin: "bg-blue-600 text-white",
  twitter: "bg-green-100 text-green-800",
};

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');

  const { data: posts } = useQuery({
    queryKey: ["/api/posts"],
  });

  const scheduledPosts = posts?.filter(post => post.status === 'scheduled' || post.status === 'published') || [];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getPostsForDay = (day: number | null) => {
    if (!day) return [];
    
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    return scheduledPosts.filter(post => {
      if (post.scheduledFor) {
        const postDate = new Date(post.scheduledFor).toISOString().split('T')[0];
        return postDate === targetDateString;
      }
      if (post.publishedAt) {
        const postDate = new Date(post.publishedAt).toISOString().split('T')[0];
        return postDate === targetDateString;
      }
      return false;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-6">
      <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Calendar</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[140px] text-center">
                {monthName}
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {/* Calendar Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 dark:bg-gray-800 p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day, index) => {
              const dayPosts = getPostsForDay(day);
              
              return (
                <div key={index} className="bg-white dark:bg-gray-900 min-h-24 p-2">
                  {day && (
                    <>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map((post) => {
                          const PlatformIcon = platformIcons[post.platforms[0] as keyof typeof platformIcons];
                          const platformStyle = platformColors[post.platforms[0] as keyof typeof platformColors];
                          
                          return (
                            <div 
                              key={post.id}
                              className={`text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${platformStyle}`}
                              title={post.title}
                            >
                              <div className="flex items-center space-x-1">
                                {PlatformIcon && <PlatformIcon className="w-3 h-3" />}
                                <span className="truncate">{post.title}</span>
                              </div>
                            </div>
                          );
                        })}
                        {dayPosts.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                            +{dayPosts.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 rounded"></div>
              <span>Facebook</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-100 dark:bg-pink-900 rounded"></div>
              <span>Instagram</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-700 rounded"></div>
              <span>LinkedIn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded"></div>
              <span>Twitter</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
