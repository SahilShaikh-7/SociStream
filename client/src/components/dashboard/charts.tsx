import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Charts() {
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
  });

  // Process engagement data for line chart
  const engagementData = analytics?.filter(item => item.metric === 'engagement_rate')
    .map(item => ({
      name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      engagement: item.value / 10 // Convert to percentage
    })) || [];

  // Process platform data for pie chart
  const platformData = analytics?.filter(item => item.metric === 'platform_engagement')
    .map(item => ({
      name: item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
      value: item.value / 10
    })) || [];

  const COLORS = ['#4267B2', '#E4405F', '#0077B5', '#1DA1F2'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Engagement Chart */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Engagement Rate']} />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="hsl(var(--primary) / 0.1)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Performance */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
