# SocialFlow - Social Media Management Platform

## Overview

SocialFlow is a comprehensive social media management platform built as a full-stack web application. The system enables users to create, schedule, and publish content across multiple social media platforms including Facebook, Instagram, LinkedIn, and Twitter. It features a React-based frontend with a modern UI built using shadcn/ui components, an Express.js backend, and uses Drizzle ORM for database operations with PostgreSQL.

The platform provides analytics tracking, content templates, media management, and a unified dashboard for managing social media presence across different platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization and analytics displays

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **Development**: Hot reload with Vite integration in development mode
- **File Upload**: Multer middleware for handling media uploads with file type validation

### Database Schema Design
The application uses four main database tables:
- **Posts**: Content management with platform targeting, scheduling, and engagement metrics
- **Templates**: Reusable content templates categorized by type and platform
- **Media Items**: File storage metadata for uploaded images and videos
- **Analytics**: Performance tracking data by platform and date

### Data Storage Strategy
- **Primary Storage**: PostgreSQL database via Neon serverless hosting
- **Development Storage**: In-memory storage implementation for rapid development
- **File Storage**: Local file system with configurable upload limits (10MB max)
- **Session Management**: PostgreSQL session store using connect-pg-simple

### Authentication & Authorization
- Session-based authentication using Express sessions
- PostgreSQL-backed session storage for persistence
- Client-side authentication state management through React Query

### Component Architecture
- **Atomic Design**: Reusable UI components following shadcn/ui patterns
- **Feature-Based Organization**: Components organized by feature domains (dashboard, calendar, analytics, etc.)
- **Custom Hooks**: Specialized hooks for mobile detection, toast notifications, and form handling
- **Modal System**: Centralized modal management for create/edit operations

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **drizzle-zod**: Schema validation integration between Drizzle and Zod

### UI Component Libraries
- **@radix-ui/**: Complete suite of accessible UI primitives (30+ components)
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolver integrations

### Styling and Design
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Intelligent Tailwind class merging
- **lucide-react**: Modern icon library

### Data Visualization
- **recharts**: React charting library for analytics displays
- **embla-carousel-react**: Touch-friendly carousel component

### Development Tools
- **vite**: Fast development server and build tool
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **zod**: TypeScript-first schema validation
- **wouter**: Minimalist routing library
- **nanoid**: Unique ID generation for entities