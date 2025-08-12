import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Eye, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["/api/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest('POST', '/api/media/upload', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  // Sample media items for demonstration
  const sampleMediaItems = [
    {
      id: '1',
      filename: 'marketing-image-1.jpg',
      originalName: 'Marketing Campaign Image',
      url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: '2',
      filename: 'team-collaboration.jpg',
      originalName: 'Team Collaboration Photo',
      url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=300&fit=crop',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: '3',
      filename: 'product-photography.jpg',
      originalName: 'Product Photography',
      url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: '4',
      filename: 'design-workspace.jpg',
      originalName: 'Design Workspace',
      url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=300&fit=crop',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: '5',
      filename: 'customer-testimonial.jpg',
      originalName: 'Customer Testimonial',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: '6',
      filename: 'inspirational-quote.jpg',
      originalName: 'Inspirational Quote',
      url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=300&h=300&fit=crop',
      uploadedAt: new Date().toISOString(),
    },
  ];

  const displayItems = mediaItems?.length ? mediaItems : sampleMediaItems;

  const filteredItems = displayItems.filter(item =>
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Content Library</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
            <Button asChild disabled={uploadMutation.isPending}>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Media'}
              </label>
            </Button>
          </div>
        </div>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <img 
                    src={item.url} 
                    alt={item.originalName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate">{item.originalName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
              <p className="text-gray-500 mb-4">Upload your first media file to get started</p>
              <div>
                <input
                  type="file"
                  id="empty-upload"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                />
                <Button asChild>
                  <label htmlFor="empty-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media
                  </label>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
