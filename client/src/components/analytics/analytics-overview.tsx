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

  // Process performance data
  const performanceData = [
    { name: 'Jan', reach: 15000, impressions: 25000 },
    { name: 'Feb', reach: 18000, impressions: 28000 },
    { name: 'Mar', reach: 22000, impressions: 35000 },
    { name: 'Apr', reach: 19000, impressions: 32000 },
    { name: 'May', reach: 24000, impressions: 38000 },
    { name: 'Jun', reach: 26000, impressions: 42000 },
  ];

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
      <Card className="shadow-sm border border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
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
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Follower Growth</CardTitle>
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

        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Post Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  name="Reach"
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Impressions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Platform Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {platformStats.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <platform.icon className={`text-2xl ${platform.iconColor}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                    <p className="text-sm text-gray-500">{platform.followers} followers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{platform.engagement}</p>
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
