import Navigation from '../../../components/Navigation';
import { getPostsByTag, getAllTags } from '../../../utils/blog';
import AnimatedLink from '../../../components/AnimatedLink';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.tag.replace(/-/g, ' ');
  const posts = getPostsByTag(tag);
  
  if (posts.length === 0) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `${tag} Posts`,
    description: `Browse all posts tagged with ${tag} on unfilteredmind.`,
    alternates: {
      canonical: `/tags/${resolvedParams.tag}`,
    },
    openGraph: {
      title: `${tag} Posts | unfilteredmind`,
      description: `Browse all posts tagged with ${tag} on unfilteredmind.`,
      url: `/tags/${resolvedParams.tag}`,
      type: 'website',
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const tag = resolvedParams.tag.replace(/-/g, ' ');
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
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
                  { '@type': 'ListItem', position: 3, name: `Tag: ${tag}`, item: `/tags/${resolvedParams.tag}` },
                ],
              }),
            }}
          />
          
          <h1 className="title">Posts tagged with &quot;{tag}&quot;</h1>
          <p className="subtitle">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
          
          <ul className="blog-posts">
            {posts.map((post) => (
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
                      {post.tags.split(',').map((postTag, index) => (
                        <span key={index} className="blog-post-tag">
                          {postTag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </AnimatedLink>
              </li>
            ))}
          </ul>
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
