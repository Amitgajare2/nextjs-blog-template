import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'blog');

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

      // Combine the data with the slug
      return {
        slug,
        ...matterResult.data,
        content: matterResult.content,
      } as Omit<BlogPost, 'contentHtml'>;
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
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the slug and contentHtml
    return {
      slug,
      contentHtml,
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

      return {
        slug,
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
