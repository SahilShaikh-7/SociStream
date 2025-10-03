import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X, CloudUpload } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platforms = [
  { id: 'facebook', label: 'Facebook', icon: SiFacebook, color: 'text-blue-600' },
  { id: 'instagram', label: 'Instagram', icon: SiInstagram, color: 'text-pink-500' },
  { id: 'linkedin', label: 'LinkedIn', icon: SiLinkedin, color: 'text-blue-700' },
  { id: 'twitter', label: 'Twitter', icon: SiX, color: 'text-blue-400' },
];

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [publishOption, setPublishOption] = useState("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequest('POST', '/api/posts', postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      toast({
        title: "Success",
        description: publishOption === "now" ? "Post published successfully!" : "Post scheduled successfully!",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleClose = () => {
    setTitle("");
    setContent("");
    setSelectedPlatforms([]);
    setPublishOption("now");
    setScheduledDate("");
    setScheduledTime("");
    onClose();
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms(prev => [...prev, platformId]);
    } else {
      setSelectedPlatforms(prev => prev.filter(id => id !== platformId));
    }
  };

  const handleSaveDraft = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and content to save as draft.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ["facebook"],
      status: "draft",
      scheduledFor: null,
    };

    createPostMutation.mutate(postData);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      platforms: selectedPlatforms,
      status: publishOption === "now" ? "published" : "scheduled",
      scheduledFor: publishOption === "later" && scheduledDate && scheduledTime 
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : null,
    };

    createPostMutation.mutate(postData);
  };

  const characterCount = content.length;
  const maxCharacters = 280; // Twitter limit as reference

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-900 dark:text-white">
            Create New Post
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Post Title
            </Label>
            <Input
              id="title"
              data-testid="input-post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your post"
              className="mt-1"
            />
          </div>

          {/* Platform Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Select Platforms
            </Label>
            <div className="flex flex-wrap gap-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    data-testid={`checkbox-platform-${platform.id}`}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                  />
                  <Label htmlFor={platform.id} className="flex items-center space-x-2 cursor-pointer">
                    <platform.icon className={`${platform.color}`} />
                    <span className="text-sm">{platform.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Post Content
            </Label>
            <Textarea
              id="content"
              data-testid="input-post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share with your audience?"
              className="mt-1 h-32 resize-none"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Character count: {characterCount}</span>
              {characterCount > maxCharacters && (
                <span className="text-red-500">Exceeds Twitter limit ({maxCharacters})</span>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Add Media
            </Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <CloudUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop files here or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports JPG, PNG, MP4, GIF up to 10MB
              </p>
            </div>
          </div>

          {/* Publishing Options */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Publishing Options
            </Label>
            <RadioGroup value={publishOption} onValueChange={setPublishOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now" className="text-sm">Publish now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="later" id="later" />
                <Label htmlFor="later" className="text-sm">Schedule for later</Label>
              </div>
            </RadioGroup>

            {publishOption === "later" && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="px-3 py-2"
                />
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="px-3 py-2"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={handleSaveDraft}
              data-testid="button-save-draft"
              disabled={createPostMutation.isPending || !title.trim() || !content.trim()}
            >
              {createPostMutation.isPending ? "Saving..." : "Save as Draft"}
            </Button>
            <Button 
              onClick={handleSubmit}
              data-testid="button-publish-post"
              disabled={createPostMutation.isPending || !title.trim() || !content.trim() || selectedPlatforms.length === 0}
            >
              {createPostMutation.isPending 
                ? "Creating..." 
                : publishOption === "now" 
                  ? "Publish Post" 
                  : "Schedule Post"
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
