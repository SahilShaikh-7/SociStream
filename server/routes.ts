import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertTemplateSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data", error });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.updatePost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  app.get("/api/posts/status/:status", async (req, res) => {
    try {
      const posts = await storage.getPostsByStatus(req.params.status);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts by status" });
    }
  });

  // Templates routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data", error });
    }
  });

  app.get("/api/templates/category/:category", async (req, res) => {
    try {
      const templates = await storage.getTemplatesByCategory(req.params.category);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates by category" });
    }
  });

  // Media routes
  app.get("/api/media", async (req, res) => {
    try {
      const mediaItems = await storage.getMediaItems();
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });

  app.post("/api/media/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const mediaItem = await storage.createMediaItem({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
      });

      res.status(201).json(mediaItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file", error });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMediaItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Media item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const { startDate, endDate, platform } = req.query;
      
      let analytics;
      if (startDate && endDate) {
        analytics = await storage.getAnalyticsByDateRange(startDate as string, endDate as string);
      } else if (platform) {
        analytics = await storage.getAnalyticsByPlatform(platform as string);
      } else {
        analytics = await storage.getAnalytics();
      }
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      const scheduledPosts = await storage.getPostsByStatus('scheduled');
      const analytics = await storage.getAnalytics();
      
      // Calculate summary stats
      const totalPosts = posts.length;
      const totalEngagement = posts.reduce((sum, post) => 
        sum + post.engagementStats.likes + post.engagementStats.comments + post.engagementStats.shares, 0
      );
      const totalReach = posts.reduce((sum, post) => sum + post.engagementStats.reach, 0);
      const avgEngagementRate = totalPosts > 0 ? (totalEngagement / totalReach * 100) : 0;
      
      const summary = {
        totalPosts,
        engagementRate: Math.round(avgEngagementRate * 10) / 10,
        totalReach: totalReach,
        scheduledPosts: scheduledPosts.length,
        nextScheduledPost: scheduledPosts
          .filter(post => post.scheduledFor && new Date(post.scheduledFor) > new Date())
          .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime())[0]
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
