import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Share } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

const platformIcons = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  linkedin: SiLinkedin,
  twitter: SiX,
};

const platformColors = {
  facebook: "text-blue-600",
  instagram: "text-pink-500",
  linkedin: "text-blue-700",
  twitter: "text-blue-400",
};

export default function RecentPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentPosts = posts?.slice(0, 3) || [];

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentPosts.map((post) => {
            const PlatformIcon = platformIcons[post.platforms[0] as keyof typeof platformIcons];
            const platformColor = platformColors[post.platforms[0] as keyof typeof platformColors];
            
            return (
              <div key={post.id} className="py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-4">
                  {post.mediaUrl ? (
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Share className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center">
                        {PlatformIcon && <PlatformIcon className={`mr-1 ${platformColor}`} />}
                        {post.platforms[0].charAt(0).toUpperCase() + post.platforms[0].slice(1)}
                      </span>
                      <span>{post.publishedAt ? formatTimeAgo(post.publishedAt) : 'Draft'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-1" />
                    {post.engagementStats.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-blue-500 mr-1" />
                    {post.engagementStats.comments}
                  </span>
                  <span className="flex items-center">
                    <Share className="w-4 h-4 text-green-500 mr-1" />
                    {post.engagementStats.shares}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
