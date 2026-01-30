/**
 * CMS Mock Data for Development and Testing
 * Use this when the backend API is not available
 */

import type {
  IMarketingContent,
  IContentCategory,
  IContentTag,
  ICmsStats,
} from "../types";

// Generate a UUID-like ID
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate a slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generate ISO date string
function generateDate(daysAgo = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// ============================================================================
// Mock Categories
// ============================================================================

export const mockCategories: IContentCategory[] = [
  {
    id: generateId(),
    name: "Marketing",
    slug: "marketing",
    description: "Marketing related content and campaigns",
    isActive: true,
    createdAt: generateDate(30),
    updatedAt: generateDate(5),
    _count: { contents: 12 },
  },
  {
    id: generateId(),
    name: "Product Updates",
    slug: "product-updates",
    description: "Product announcements and feature releases",
    isActive: true,
    createdAt: generateDate(25),
    updatedAt: generateDate(2),
    _count: { contents: 8 },
  },
  {
    id: generateId(),
    name: "Events",
    slug: "events",
    description: "Event promotions and announcements",
    isActive: true,
    createdAt: generateDate(20),
    updatedAt: generateDate(1),
    _count: { contents: 5 },
  },
  {
    id: generateId(),
    name: "Company News",
    slug: "company-news",
    description: "Internal and external company announcements",
    isActive: true,
    createdAt: generateDate(15),
    updatedAt: generateDate(3),
    _count: { contents: 15 },
  },
  {
    id: generateId(),
    name: "Tutorials",
    slug: "tutorials",
    description: "How-to guides and educational content",
    isActive: false,
    createdAt: generateDate(10),
    updatedAt: generateDate(7),
    _count: { contents: 3 },
  },
];

// ============================================================================
// Mock Tags
// ============================================================================

export const mockTags: IContentTag[] = [
  {
    id: generateId(),
    name: "Featured",
    slug: "featured",
    color: "#EF4444",
    isActive: true,
    createdAt: generateDate(30),
    updatedAt: generateDate(5),
    _count: { contents: 8 },
  },
  {
    id: generateId(),
    name: "New",
    slug: "new",
    color: "#22C55E",
    isActive: true,
    createdAt: generateDate(28),
    updatedAt: generateDate(3),
    _count: { contents: 12 },
  },
  {
    id: generateId(),
    name: "Important",
    slug: "important",
    color: "#F97316",
    isActive: true,
    createdAt: generateDate(25),
    updatedAt: generateDate(2),
    _count: { contents: 5 },
  },
  {
    id: generateId(),
    name: "Trending",
    slug: "trending",
    color: "#8B5CF6",
    isActive: true,
    createdAt: generateDate(20),
    updatedAt: generateDate(1),
    _count: { contents: 7 },
  },
  {
    id: generateId(),
    name: "Archived",
    slug: "archived",
    color: "#64748B",
    isActive: false,
    createdAt: generateDate(15),
    updatedAt: generateDate(10),
    _count: { contents: 2 },
  },
];

// ============================================================================
// Mock Content
// ============================================================================

export const mockContents: IMarketingContent[] = [
  {
    id: generateId(),
    title: "Summer Sale 2026 - Up to 50% Off",
    slug: "summer-sale-2026",
    type: "BANNER",
    status: "PUBLISHED",
    summary: "Biggest sale of the summer with amazing discounts",
    content: "<h1>Summer Sale</h1><p>Get up to 50% off on all products!</p>",
    featuredImage: "https://picsum.photos/seed/1/800/400",
    priority: 90,
    isActive: true,
    viewCount: 1520,
    categoryId: mockCategories[0].id,
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1]],
    authorId: "user-1",
    author: { id: "user-1", name: "John Doe", email: "john@example.com" },
    createdAt: generateDate(7),
    updatedAt: generateDate(1),
    publishedAt: generateDate(5),
  },
  {
    id: generateId(),
    title: "New Feature: Advanced Analytics Dashboard",
    slug: "new-feature-analytics",
    type: "ANNOUNCEMENT",
    status: "PUBLISHED",
    summary: "Introducing our new analytics dashboard with powerful insights",
    content:
      "<h1>New Analytics</h1><p>Track your performance like never before.</p>",
    featuredImage: "https://picsum.photos/seed/2/800/400",
    priority: 80,
    isActive: true,
    viewCount: 890,
    categoryId: mockCategories[1].id,
    category: mockCategories[1],
    tags: [mockTags[1], mockTags[3]],
    authorId: "user-2",
    author: { id: "user-2", name: "Jane Smith", email: "jane@example.com" },
    createdAt: generateDate(10),
    updatedAt: generateDate(3),
    publishedAt: generateDate(8),
  },
  {
    id: generateId(),
    title: "Annual Conference 2026",
    slug: "annual-conference-2026",
    type: "HERO",
    status: "SCHEDULED",
    summary: "Join us for our biggest event of the year",
    content: "<h1>Annual Conference</h1><p>Register now and save!</p>",
    featuredImage: "https://picsum.photos/seed/3/800/400",
    priority: 95,
    isActive: true,
    viewCount: 0,
    categoryId: mockCategories[2].id,
    category: mockCategories[2],
    tags: [mockTags[0], mockTags[2]],
    authorId: "user-1",
    author: { id: "user-1", name: "John Doe", email: "john@example.com" },
    createdAt: generateDate(5),
    updatedAt: generateDate(1),
    scheduledAt: generateDate(-7),
  },
  {
    id: generateId(),
    title: "Customer Success Story: TechCorp",
    slug: "customer-success-techcorp",
    type: "TESTIMONIAL",
    status: "DRAFT",
    summary: "How TechCorp increased productivity by 40%",
    content: "<h1>TechCorp Success</h1><p>A detailed case study...</p>",
    priority: 50,
    isActive: true,
    viewCount: 0,
    categoryId: mockCategories[3].id,
    category: mockCategories[3],
    tags: [mockTags[3]],
    authorId: "user-2",
    author: { id: "user-2", name: "Jane Smith", email: "jane@example.com" },
    createdAt: generateDate(3),
    updatedAt: generateDate(1),
  },
  {
    id: generateId(),
    title: "FAQ: Getting Started Guide",
    slug: "faq-getting-started",
    type: "FAQ",
    status: "PUBLISHED",
    summary: "Common questions about getting started",
    content: "<h1>FAQ</h1><p>Frequently asked questions...</p>",
    priority: 60,
    isActive: true,
    viewCount: 2340,
    categoryId: mockCategories[4].id,
    category: mockCategories[4],
    tags: [],
    authorId: "user-1",
    author: { id: "user-1", name: "John Doe", email: "john@example.com" },
    createdAt: generateDate(20),
    updatedAt: generateDate(5),
    publishedAt: generateDate(18),
  },
  // Additional Announcement content for landing page
  {
    id: generateId(),
    title: "Platform Maintenance Scheduled",
    slug: "platform-maintenance-scheduled",
    type: "ANNOUNCEMENT",
    status: "PUBLISHED",
    summary:
      "Scheduled maintenance on February 15th, 2026 from 2:00 AM to 6:00 AM UTC. Some services may be temporarily unavailable.",
    content:
      "<h1>Scheduled Maintenance</h1><p>We will be performing scheduled maintenance to improve system performance.</p>",
    featuredImage: "https://picsum.photos/seed/announce1/800/400",
    priority: 85,
    isActive: true,
    viewCount: 450,
    categoryId: mockCategories[3].id,
    category: mockCategories[3],
    tags: [mockTags[2]],
    authorId: "user-1",
    author: { id: "user-1", name: "John Doe", email: "john@example.com" },
    createdAt: generateDate(2),
    updatedAt: generateDate(1),
    publishedAt: generateDate(1),
  },
  {
    id: generateId(),
    title: "New Mobile App Now Available",
    slug: "new-mobile-app-available",
    type: "ANNOUNCEMENT",
    status: "PUBLISHED",
    summary:
      "Download our brand new mobile app for iOS and Android. Manage your events on the go with seamless synchronization.",
    content:
      "<h1>Mobile App Launch</h1><p>Experience event management like never before with our new mobile app.</p>",
    featuredImage: "https://picsum.photos/seed/announce2/800/400",
    priority: 88,
    isActive: true,
    viewCount: 1200,
    categoryId: mockCategories[1].id,
    category: mockCategories[1],
    tags: [mockTags[0], mockTags[1]],
    authorId: "user-2",
    author: { id: "user-2", name: "Jane Smith", email: "jane@example.com" },
    createdAt: generateDate(5),
    updatedAt: generateDate(2),
    publishedAt: generateDate(4),
  },
  {
    id: generateId(),
    title: "Early Bird Registration Open",
    slug: "early-bird-registration-open",
    type: "ANNOUNCEMENT",
    status: "PUBLISHED",
    summary:
      "Register now for the 2026 Annual Summit and save 30% with our early bird pricing. Limited spots available!",
    content:
      "<h1>Early Bird Special</h1><p>Don't miss out on exclusive early bird pricing for our biggest event of the year.</p>",
    featuredImage: "https://picsum.photos/seed/announce3/800/400",
    priority: 92,
    isActive: true,
    viewCount: 780,
    categoryId: mockCategories[2].id,
    category: mockCategories[2],
    tags: [mockTags[0], mockTags[2]],
    authorId: "user-1",
    author: { id: "user-1", name: "John Doe", email: "john@example.com" },
    createdAt: generateDate(3),
    updatedAt: generateDate(1),
    publishedAt: generateDate(2),
  },
];

// ============================================================================
// Mock Stats
// ============================================================================

export const mockStats: ICmsStats = {
  totalContent: mockContents.length,
  contentByType: {
    BANNER: 1,
    HERO: 1,
    PROMOTION: 0,
    ANNOUNCEMENT: 4,
    BLOG: 0,
    TESTIMONIAL: 1,
    FAQ: 1,
    FEATURE: 0,
  },
  contentByStatus: {
    DRAFT: 1,
    PUBLISHED: 3,
    ARCHIVED: 0,
    SCHEDULED: 1,
  },
  activeCategories: mockCategories.filter((c) => c.isActive).length,
  totalCategories: mockCategories.length,
  activeTags: mockTags.filter((t) => t.isActive).length,
  totalTags: mockTags.length,
  recentContent: mockContents.slice(0, 5),
  popularContent: [...mockContents]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5),
};

// ============================================================================
// Mock Data Store (In-Memory CRUD)
// ============================================================================

class MockDataStore<T extends { id: string }> {
  private items: T[];
  private generateId: () => string;

  constructor(initialItems: T[]) {
    this.items = [...initialItems];
    this.generateId = generateId;
  }

  getAll(): T[] {
    return [...this.items];
  }

  getById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    const newItem: T = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as T;
    this.items.push(newItem);
    return newItem;
  }

  update(id: string, data: Partial<T>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.items[index];
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}

// Create stores for each entity type
export const categoryStore = new MockDataStore(mockCategories);
export const tagStore = new MockDataStore(mockTags);
export const contentStore = new MockDataStore(mockContents);

// Export utility
export { generateId };
