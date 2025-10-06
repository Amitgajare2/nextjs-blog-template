import Navigation from '../../../components/Navigation';
import SocialShare from '../../../components/SocialShare';
import TableOfContents from '../../../components/TableOfContents';
import { getPostData, getAllPostSlugs, extractHeadings } from '../../../utils/blog';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const post = await getPostData(params.slug);
    return {
      title: post.title,
      description: post.description,
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  let post;
  
  try {
    post = await getPostData(params.slug);
  } catch (error) {
    notFound();
  }

  const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`;
  const headings = extractHeadings(post.contentHtml);

  return (
    <>
      <Navigation />
      <main className="main">
        <div className="blog-layout">
          <article className="blog-content">
            <h1>{post.title}</h1>
            
            <div className="blog-post-meta">
              <span className="blog-post-date">{post.date}</span>
              <span>• {post.readTime}</span>
            </div>
            
            {post.tags && (
              <div className="blog-post-tags">
                {post.tags.split(',').map((tag, index) => (
                  <span key={index} className="blog-post-tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            
            <SocialShare 
              title={post.title}
              url={postUrl}
              description={post.description}
            />
          </article>
          
          {headings.length > 0 && (
            <aside className="blog-sidebar">
              <TableOfContents headings={headings} />
            </aside>
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
