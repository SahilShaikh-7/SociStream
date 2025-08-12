import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Layers } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

const categoryTabs = [
  { id: 'all', label: 'All' },
  { id: 'promotional', label: 'Promotional' },
  { id: 'educational', label: 'Educational' },
  { id: 'motivational', label: 'Motivational' },
  { id: 'behind-the-scenes', label: 'Behind the Scenes' },
];

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

export default function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  // Sample templates for demonstration
  const sampleTemplates = [
    {
      id: 't1',
      name: 'Product Showcase',
      description: 'Perfect for highlighting new products with compelling visuals and call-to-action.',
      category: 'promotional',
      platforms: ['instagram', 'facebook', 'linkedin'],
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    },
    {
      id: 't2',
      name: 'Motivational Quote',
      description: 'Inspire your audience with beautifully designed quote posts that drive engagement.',
      category: 'motivational',
      platforms: ['instagram', 'twitter', 'linkedin'],
      imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=300&h=200&fit=crop',
    },
    {
      id: 't3',
      name: 'Behind the Scenes',
      description: 'Show your company culture and build authentic connections with your audience.',
      category: 'behind-the-scenes',
      platforms: ['instagram', 'facebook', 'twitter'],
      imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=200&fit=crop',
    },
    {
      id: 't4',
      name: 'Customer Testimonial',
      description: 'Build trust and credibility by showcasing positive customer experiences.',
      category: 'promotional',
      platforms: ['facebook', 'linkedin', 'twitter'],
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop',
    },
    {
      id: 't5',
      name: 'Educational Tips',
      description: 'Share valuable knowledge and position your brand as an industry expert.',
      category: 'educational',
      platforms: ['linkedin', 'facebook', 'instagram'],
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
    },
    {
      id: 't6',
      name: 'Sale Promotion',
      description: 'Drive conversions with attractive promotional posts that highlight your best offers.',
      category: 'promotional',
      platforms: ['facebook', 'instagram', 'twitter'],
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    },
  ];

  const displayTemplates = templates?.length ? templates : sampleTemplates;

  const filteredTemplates = activeCategory === 'all' 
    ? displayTemplates 
    : displayTemplates.filter(template => template.category === activeCategory);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Post Templates</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 mb-6">
        {categoryTabs.map(tab => (
          <Button
            key={tab.id}
            variant={activeCategory === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <img 
                  src={template.imageUrl} 
                  alt={template.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {template.platforms.slice(0, 3).map(platform => {
                      const PlatformIcon = platformIcons[platform as keyof typeof platformIcons];
                      const platformColor = platformColors[platform as keyof typeof platformColors];
                      return (
                        <PlatformIcon key={platform} className={`w-4 h-4 ${platformColor}`} />
                      );
                    })}
                    {template.platforms.length > 3 && (
                      <span className="text-xs text-gray-500">+{template.platforms.length - 3}</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredTemplates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Layers className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-4">
            {activeCategory === 'all' 
              ? 'Create your first template to get started'
              : `No templates found in the ${activeCategory} category`
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}
    </div>
  );
}
