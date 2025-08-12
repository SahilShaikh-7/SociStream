import { type Post, type InsertPost, type Template, type InsertTemplate, type MediaItem, type InsertMediaItem, type Analytics, type InsertAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Posts
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  getPostsByStatus(status: string): Promise<Post[]>;
  getPostsByDateRange(startDate: string, endDate: string): Promise<Post[]>;

  // Templates
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  deleteTemplate(id: string): Promise<boolean>;
  getTemplatesByCategory(category: string): Promise<Template[]>;

  // Media
  getMediaItems(): Promise<MediaItem[]>;
  getMediaItem(id: string): Promise<MediaItem | undefined>;
  createMediaItem(media: InsertMediaItem): Promise<MediaItem>;
  deleteMediaItem(id: string): Promise<boolean>;

  // Analytics
  getAnalytics(): Promise<Analytics[]>;
  getAnalyticsByDateRange(startDate: string, endDate: string): Promise<Analytics[]>;
  getAnalyticsByPlatform(platform: string): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private posts: Map<string, Post>;
  private templates: Map<string, Template>;
  private mediaItems: Map<string, MediaItem>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.posts = new Map();
    this.templates = new Map();
    this.mediaItems = new Map();
    this.analytics = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample posts
    const samplePosts: Post[] = [
      {
        id: "1",
        title: "Summer Sale Campaign",
        content: "🌞 Summer Sale is here! Get 30% off all products. Limited time offer! #SummerSale #Discount",
        platforms: ["instagram", "facebook"],
        status: "published",
        scheduledFor: null,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        mediaUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
        mediaType: "image",
        templateId: null,
        engagementStats: { likes: 342, comments: 28, shares: 15, reach: 2400 },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: "2",
        title: "Monday Motivation Quote",
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts. 💪 #MondayMotivation #Success",
        platforms: ["linkedin", "twitter"],
        status: "published",
        scheduledFor: null,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        mediaUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
        mediaType: "image",
        templateId: null,
        engagementStats: { likes: 189, comments: 12, shares: 8, reach: 1800 },
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
      },
      {
        id: "3",
        title: "New Product Launch",
        content: "Exciting news! 🚀 We're launching our new product line next week. Stay tuned for more details! #ProductLaunch #Innovation",
        platforms: ["facebook", "instagram", "linkedin"],
        status: "published",
        scheduledFor: null,
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        mediaUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        mediaType: "image",
        templateId: null,
        engagementStats: { likes: 567, comments: 45, shares: 23, reach: 3200 },
        createdAt: new Date(Date.now() - 49 * 60 * 60 * 1000),
      }
    ];

    // Sample templates
    const sampleTemplates: Template[] = [
      {
        id: "t1",
        name: "Product Showcase",
        description: "Perfect for highlighting new products with compelling visuals and call-to-action.",
        category: "promotional",
        platforms: ["instagram", "facebook", "linkedin"],
        contentTemplate: "🎉 Introducing our latest product: [PRODUCT_NAME]!\n\n[PRODUCT_DESCRIPTION]\n\n✨ Key features:\n• [FEATURE_1]\n• [FEATURE_2]\n• [FEATURE_3]\n\nGet yours today! Link in bio 👆\n\n#[BRAND] #[PRODUCT_CATEGORY] #NewProduct",
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300",
        createdAt: new Date(),
      },
      {
        id: "t2",
        name: "Motivational Quote",
        description: "Inspire your audience with beautifully designed quote posts that drive engagement.",
        category: "motivational",
        platforms: ["instagram", "twitter", "linkedin"],
        contentTemplate: "💫 \"[QUOTE_TEXT]\"\n\n- [QUOTE_AUTHOR]\n\nWhat's your favorite motivational quote? Share it in the comments! 👇\n\n#Motivation #Inspiration #[BRAND]",
        imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=300",
        createdAt: new Date(),
      },
      {
        id: "t3",
        name: "Behind the Scenes",
        description: "Show your company culture and build authentic connections with your audience.",
        category: "behind-the-scenes",
        platforms: ["instagram", "facebook", "twitter"],
        contentTemplate: "👥 Behind the scenes at [COMPANY_NAME]!\n\n[BTS_DESCRIPTION]\n\nWe love what we do and it shows in everything we create! 💼\n\n#BehindTheScenes #TeamWork #[BRAND] #CompanyCulture",
        imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300",
        createdAt: new Date(),
      }
    ];

    // Sample analytics data
    const sampleAnalytics: Analytics[] = [
      // Engagement data for the week
      { id: "a1", date: "2024-12-09", platform: "instagram", metric: "engagement_rate", value: 62, createdAt: new Date() },
      { id: "a2", date: "2024-12-10", platform: "instagram", metric: "engagement_rate", value: 81, createdAt: new Date() },
      { id: "a3", date: "2024-12-11", platform: "instagram", metric: "engagement_rate", value: 74, createdAt: new Date() },
      { id: "a4", date: "2024-12-12", platform: "instagram", metric: "engagement_rate", value: 92, createdAt: new Date() },
      { id: "a5", date: "2024-12-13", platform: "instagram", metric: "engagement_rate", value: 88, createdAt: new Date() },
      { id: "a6", date: "2024-12-14", platform: "instagram", metric: "engagement_rate", value: 121, createdAt: new Date() },
      { id: "a7", date: "2024-12-15", platform: "instagram", metric: "engagement_rate", value: 103, createdAt: new Date() },
      
      // Platform follower counts
      { id: "a8", date: "2024-12-15", platform: "facebook", metric: "followers", value: 12500, createdAt: new Date() },
      { id: "a9", date: "2024-12-15", platform: "instagram", metric: "followers", value: 8900, createdAt: new Date() },
      { id: "a10", date: "2024-12-15", platform: "linkedin", metric: "followers", value: 3200, createdAt: new Date() },
      { id: "a11", date: "2024-12-15", platform: "twitter", metric: "followers", value: 5700, createdAt: new Date() },
      
      // Platform engagement rates
      { id: "a12", date: "2024-12-15", platform: "facebook", metric: "platform_engagement", value: 82, createdAt: new Date() },
      { id: "a13", date: "2024-12-15", platform: "instagram", metric: "platform_engagement", value: 127, createdAt: new Date() },
      { id: "a14", date: "2024-12-15", platform: "linkedin", metric: "platform_engagement", value: 64, createdAt: new Date() },
      { id: "a15", date: "2024-12-15", platform: "twitter", metric: "platform_engagement", value: 41, createdAt: new Date() },
    ];

    samplePosts.forEach(post => this.posts.set(post.id, post));
    sampleTemplates.forEach(template => this.templates.set(template.id, template));
    sampleAnalytics.forEach(analytics => this.analytics.set(analytics.id, analytics));
  }

  // Posts methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      ...insertPost,
      id,
      createdAt: new Date(),
      publishedAt: insertPost.status === 'published' ? new Date() : null,
      engagementStats: { likes: 0, comments: 0, shares: 0, reach: 0 },
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: string, updateData: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updateData };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getPostsByStatus(status: string): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.status === status);
  }

  async getPostsByDateRange(startDate: string, endDate: string): Promise<Post[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Array.from(this.posts.values()).filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= start && postDate <= end;
    });
  }

  // Templates methods
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      ...insertTemplate,
      id,
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.category === category);
  }

  // Media methods
  async getMediaItems(): Promise<MediaItem[]> {
    return Array.from(this.mediaItems.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getMediaItem(id: string): Promise<MediaItem | undefined> {
    return this.mediaItems.get(id);
  }

  async createMediaItem(insertMedia: InsertMediaItem): Promise<MediaItem> {
    const id = randomUUID();
    const media: MediaItem = {
      ...insertMedia,
      id,
      uploadedAt: new Date(),
    };
    this.mediaItems.set(id, media);
    return media;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    return this.mediaItems.delete(id);
  }

  // Analytics methods
  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }

  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => {
      return analytics.date >= startDate && analytics.date <= endDate;
    });
  }

  async getAnalyticsByPlatform(platform: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.platform === platform);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = {
      ...insertAnalytics,
      id,
      createdAt: new Date(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }
}

export const storage = new MemStorage();
