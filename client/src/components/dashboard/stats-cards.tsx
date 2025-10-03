import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Share, Heart, Eye, Clock } from "lucide-react";

export default function StatsCards() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Posts",
      value: summary?.totalPosts || 0,
      change: "+12% from last month",
      changeType: "positive",
      icon: Share,
      iconBg: "bg-blue-100",
      iconColor: "text-primary"
    },
    {
      title: "Engagement Rate",
      value: `${summary?.engagementRate || 0}%`,
      change: "+2.1% from last month",
      changeType: "positive",
      icon: Heart,
      iconBg: "bg-green-100",
      iconColor: "text-accent"
    },
    {
      title: "Reach",
      value: `${(summary?.totalReach || 0) / 1000}K`,
      change: "-3.2% from last month",
      changeType: "negative",
      icon: Eye,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Scheduled Posts",
      value: summary?.scheduledPosts || 0,
      change: summary?.nextScheduledPost ? "Next: Today 3:00 PM" : "No scheduled posts",
      changeType: "neutral",
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-accent' : 
                  stat.changeType === 'negative' ? 'text-warning' : 
                  'text-primary'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.iconBg} dark:bg-opacity-20 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.iconColor} text-lg`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
