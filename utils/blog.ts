import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { visit } from 'unist-util-visit';

const postsDirectory = path.join(process.cwd(), 'blog');

// Plugin to add IDs to headings
function addHeadingIds() {
  return (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      if (node.children && node.children.length > 0) {
        const text = node.children
          .filter((child: any) => child.type === 'text')
          .map((child: any) => child.value)
          .join('');
        
        // Generate ID from heading text
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .trim();
        
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.id = id;
      }
    });
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  readTime?: string;
  tags?: string;
  content: string;
  contentHtml: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  description?: string;
  readTime?: string;
  tags?: string;
}

export interface PaginatedPosts {
  posts: BlogPostSummary[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

export function getSortedPostsData(): BlogPost[] {
  // Get file names under /blog
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Calculate read time if not already provided
      const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

      // Combine the data with the slug
      return {
        slug,
        contentHtml: '', // Will be populated when needed
        readTime,
        ...matterResult.data,
        content: matterResult.content,
      } as BlogPost;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<BlogPost> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(addHeadingIds)
      .use(html)
      .process(matterResult.content);
    const contentHtml = enhanceImagesInHtml(processedContent.toString());

    // Calculate read time if not already provided
    const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

    // Combine the data with the slug and contentHtml
    return {
      slug,
      contentHtml,
      readTime,
      ...matterResult.data,
      content: matterResult.content,
    } as BlogPost;
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    throw error;
  }
}

export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export function getPostsSummary(): BlogPostSummary[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // Calculate read time if not already provided
      const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

      return {
        slug,
        readTime,
        ...matterResult.data,
      } as BlogPostSummary;
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPaginatedPosts(page: number = 1, postsPerPage: number = 6): PaginatedPosts {
  const allPosts = getPostsSummary();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage: page,
    totalPosts,
  };
}

export function searchPosts(query: string): BlogPostSummary[] {
  const allPosts = getPostsSummary();
  const lowercaseQuery = query.toLowerCase();
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.description?.toLowerCase().includes(lowercaseQuery) ||
    post.tags?.toLowerCase().includes(lowercaseQuery)
  );
}

export function getPostsByTag(tag: string): BlogPostSummary[] {
  const allPosts = getPostsSummary();
  const lowercaseTag = tag.toLowerCase();
  
  return allPosts.filter(post => 
    post.tags?.toLowerCase().includes(lowercaseTag)
  );
}

export function getAllTags(): string[] {
  const allPosts = getPostsSummary();
  const tagSet = new Set<string>();
  
  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.split(',').forEach(tag => {
        tagSet.add(tag.trim());
      });
    }
  });
  
  return Array.from(tagSet).sort();
}

// Calculate reading time based on word count (average 200 words per minute)
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Extract headings from HTML content for table of contents
export function extractHeadings(htmlContent: string): Array<{id: string, text: string, level: number}> {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: Array<{id: string, text: string, level: number}> = [];
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, ''); // Remove HTML tags from text
    
    headings.push({
      id,
      text,
      level
    });
  }

  return headings;
}

// Get related posts based on shared tags
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPostSummary[] {
  const allPosts = getPostsSummary();
  const currentPost = allPosts.find(post => post.slug === currentSlug);
  
  if (!currentPost || !currentPost.tags) {
    // If no tags, return most recent posts excluding current
    return allPosts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  }

  const currentTags = currentPost.tags.split(',').map(tag => tag.trim().toLowerCase());
  
  // Score posts based on shared tags
  const scoredPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      if (!post.tags) return { post, score: 0 };
      
      const postTags = post.tags.split(',').map(tag => tag.trim().toLowerCase());
      const sharedTags = currentTags.filter(tag => postTags.includes(tag));
      const score = sharedTags.length;
      
      return { post, score };
    })
    .sort((a, b) => b.score - a.score);

  // Return top scored posts, fallback to recent if not enough matches
  const relatedPosts = scoredPosts.slice(0, limit).map(item => item.post);
  
  if (relatedPosts.length < limit) {
    const recentPosts = allPosts
      .filter(post => post.slug !== currentSlug && !relatedPosts.some(rp => rp.slug === post.slug))
      .slice(0, limit - relatedPosts.length);
    relatedPosts.push(...recentPosts);
  }

  return relatedPosts;
}

// Ensure images are lazy-loaded and have descriptive alt attributes in generated HTML
function enhanceImagesInHtml(html: string): string {
  return html.replace(/<img([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;

    // Add loading="lazy" if missing
    if (!/\bloading\s*=\s*"?lazy"?/i.test(newAttrs)) {
      newAttrs += ' loading="lazy"';
    }

    // Add decoding="async" if missing
    if (!/\bdecoding\s*=\s*"?async"?/i.test(newAttrs)) {
      newAttrs += ' decoding="async"';
    }

    // Ensure alt attribute exists and is non-empty
    if (!/\balt\s*=\s*"[^"]*"/i.test(newAttrs)) {
      // Try to derive alt from filename in src
      const srcMatch = newAttrs.match(/\bsrc\s*=\s*"([^"]+)"/i);
      let altText = 'Image';
      if (srcMatch) {
        const src = srcMatch[1];
        const filename = src.split('/').pop() || '';
        altText = filename.replace(/[-_]/g, ' ').replace(/\.[a-z0-9]+$/i, '').trim() || 'Image';
      }
      newAttrs += ` alt="${altText}"`;
    }

    return `<img${newAttrs}>`;
  });
}
