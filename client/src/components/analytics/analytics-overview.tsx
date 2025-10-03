import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AnalyticsOverview() {
  const { toast } = useToast();
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const { data: posts } = useQuery({
    queryKey: ["/api/posts"],
  });

  const exportReport = () => {
    const csvContent = [
      ['Platform', 'Followers', 'Engagement Rate', 'Change'],
      ...platformStats.map(p => [p.platform, p.followers, p.engagement, p.change]),
      [],
      ['Post Performance'],
      ['Month', 'Reach', 'Impressions'],
      ...performanceData.map(d => [d.name, d.reach, d.impressions]),
      [],
      ['Follower Growth'],
      ['Week', 'Followers'],
      ...followerData.map(d => [d.name, d.followers])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: "Your analytics report has been downloaded successfully.",
    });
  };

  // Process follower growth data
  const followerData = [
    { name: 'Week 1', followers: 120 },
    { name: 'Week 2', followers: 185 },
    { name: 'Week 3', followers: 142 },
    { name: 'Week 4', followers: 203 },
  ];

  // Process performance data from actual posts
  const publishedPosts = posts?.filter(p => p.status === 'published') || [];
  const recentPosts = publishedPosts.slice(0, 6).reverse();
  
  const performanceData = recentPosts.map((post, index) => ({
    name: post.title.substring(0, 10) + '...',
    fullTitle: post.title,
    likes: post.engagementStats?.likes || 0,
    comments: post.engagementStats?.comments || 0,
    shares: post.engagementStats?.shares || 0,
    reach: post.engagementStats?.reach || 0,
    engagement: ((post.engagementStats?.likes || 0) + (post.engagementStats?.comments || 0) + (post.engagementStats?.shares || 0)),
  }));

  // Fallback data if no posts
  const defaultPerformanceData = [
    { name: 'Post 1', fullTitle: 'Sample Post 1', likes: 120, comments: 15, shares: 8, reach: 2400, engagement: 143 },
    { name: 'Post 2', fullTitle: 'Sample Post 2', likes: 185, comments: 22, shares: 12, reach: 3200, engagement: 219 },
    { name: 'Post 3', fullTitle: 'Sample Post 3', likes: 142, comments: 18, shares: 9, reach: 2800, engagement: 169 },
    { name: 'Post 4', fullTitle: 'Sample Post 4', likes: 203, comments: 28, shares: 15, reach: 3600, engagement: 246 },
    { name: 'Post 5', fullTitle: 'Sample Post 5', likes: 167, comments: 20, shares: 11, reach: 3000, engagement: 198 },
    { name: 'Post 6', fullTitle: 'Sample Post 6', likes: 221, comments: 32, shares: 18, reach: 4200, engagement: 271 },
  ];

  const chartData = performanceData.length > 0 ? performanceData : defaultPerformanceData;

  // Get platform breakdown data
  const platformData = analytics?.filter(item => item.metric === 'followers') || [];

  const platformStats = [
    {
      platform: 'Facebook',
      icon: SiFacebook,
      iconColor: 'text-blue-600',
      followers: '12.5K',
      engagement: '8.2%',
      change: '+1.2%',
      changeType: 'positive'
    },
    {
      platform: 'Instagram',
      icon: SiInstagram,
      iconColor: 'text-pink-600',
      followers: '8.9K',
      engagement: '12.7%',
      change: '+3.1%',
      changeType: 'positive'
    },
    {
      platform: 'LinkedIn',
      icon: SiLinkedin,
      iconColor: 'text-blue-700',
      followers: '3.2K',
      engagement: '6.4%',
      change: '-0.8%',
      changeType: 'negative'
    },
    {
      platform: 'Twitter',
      icon: SiX,
      iconColor: 'text-blue-400',
      followers: '5.7K',
      engagement: '4.1%',
      change: '+0.5%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="p-6">
      {/* Date Range Selector */}
      <Card className="shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Overview</h3>
            <div className="flex items-center space-x-4">
              <Select defaultValue="7days">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} data-testid="button-export-report">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Follower Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={followerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="followers" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Post Performance - Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="likes" fill="hsl(var(--primary))" name="Likes" stackId="a" />
                <Bar dataKey="comments" fill="hsl(var(--accent))" name="Comments" stackId="a" />
                <Bar dataKey="shares" fill="hsl(var(--warning))" name="Shares" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Post Performance Table */}
      <Card className="shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Post Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Post Title</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Likes</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Comments</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Shares</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Reach</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Total Engagement</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((post, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    data-testid={`row-post-performance-${index}`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{post.fullTitle}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{post.likes.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{post.comments.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{post.shares.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{post.reach.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-primary">{post.engagement.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Platform Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {platformStats.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <platform.icon className={`text-2xl ${platform.iconColor}`} />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{platform.platform}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{platform.followers} followers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{platform.engagement}</p>
                  <p className={`text-sm ${
                    platform.changeType === 'positive' ? 'text-accent' : 'text-warning'
                  }`}>
                    {platform.change} engagement
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
