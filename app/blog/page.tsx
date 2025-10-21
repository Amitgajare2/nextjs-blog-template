import Navigation from '../../components/Navigation';
import type { Metadata } from 'next';
import SearchBar from '../../components/SearchBar';
import TagsFilter from '../../components/TagsFilter';
import Pagination from '../../components/Pagination';
import { getPaginatedPosts, getAllTags, searchPosts, getPostsByTag } from '../../utils/blog';
import AnimatedLink from '../../components/AnimatedLink';

interface BlogPageProps {
  searchParams: {
    page?: string;
    search?: string;
    tag?: string;
  };
}

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest posts on unfilteredmind.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog | unfilteredmind',
    description: 'Read the latest posts on unfilteredmind.',
    url: '/blog',
    type: 'website',
  },
};

export default async function Blog({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const searchQuery = params.search;
  const tagFilter = params.tag;
  
  let postsData;
  let allTags = getAllTags();
  
  if (searchQuery) {
    const searchResults = searchPosts(searchQuery);
    postsData = {
      posts: searchResults,
      totalPages: 1,
      currentPage: 1,
      totalPosts: searchResults.length,
    };
  } else if (tagFilter) {
    const tagResults = getPostsByTag(tagFilter);
    postsData = {
      posts: tagResults,
      totalPages: 1,
      currentPage: 1,
      totalPosts: tagResults.length,
    };
  } else {
    postsData = getPaginatedPosts(page, 6);
  }

  return (
    <>
      <Navigation />
      <main className="main">
        <div className="container">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
                  { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
                ],
              }),
            }}
          />
          <h1 className="title">My Blog</h1>
          
          <SearchBar />
          <TagsFilter tags={allTags} currentTag={tagFilter} baseUrl="/blog" />
          
          {searchQuery && (
            <div className="search-results-info">
              <p>Search results for "{searchQuery}" ({postsData.totalPosts} posts found)</p>
            </div>
          )}
          
          {tagFilter && (
            <div className="tag-results-info">
              <p>Posts tagged with "{tagFilter}" ({postsData.totalPosts} posts found)</p>
            </div>
          )}
          
          <ul className="blog-posts">
            {postsData.posts.map((post) => (
              <li key={post.slug}>
                <AnimatedLink href={`/blog/${post.slug}`} className="blog-post-link">
                  <div className="blog-post-meta">
                    <span className="blog-post-date">{post.date}</span>
                    {post.readTime && <span>• {post.readTime}</span>}
                  </div>
                  <span className="blog-post-title">{post.title}</span>
                  {post.description && (
                    <p className="blog-post-description">{post.description}</p>
                  )}
                  {post.tags && (
                    <div className="blog-post-tags">
                      {post.tags.split(',').map((tag, index) => (
                        <span key={index} className="blog-post-tag">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </AnimatedLink>
              </li>
            ))}
          </ul>
          
          {postsData.posts.length === 0 && (
            <div className="no-posts">
              <p>No posts found.</p>
            </div>
          )}
          
          {!searchQuery && !tagFilter && postsData.totalPages > 1 && (
            <Pagination
              currentPage={postsData.currentPage}
              totalPages={postsData.totalPages}
              baseUrl="/blog"
            />
          )}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer">rss</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">github</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">view source</a>
          </div>
          <div className="copyright">© 2024 MIT Licensed</div>
        </div>
      </footer>
    </>
  );
}

