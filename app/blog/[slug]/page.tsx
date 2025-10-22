import Navigation from '../../../components/Navigation';
import SocialShare from '../../../components/SocialShare';
import TableOfContents from '../../../components/TableOfContents';
import RelatedPosts from '../../../components/RelatedPosts';
import AuthorBio from '../../../components/AuthorBio';
import { getPostData, getAllPostSlugs, extractHeadings, getRelatedPosts } from '../../../utils/blog';
import { getAuthorData } from '../../../utils/author';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await getPostData(resolvedParams.slug);
    const author = getAuthorData();
    
    return {
      title: post.title,
      description: post.description,
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.description,
        url: `/blog/${post.slug}`,
        publishedTime: new Date(post.date).toISOString(),
        authors: [author.name],
        tags: post.tags?.split(',').map((t) => t.trim()),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        creator: author.social.twitter ? `@${author.social.twitter.split('/').pop()}` : undefined,
      },
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
    const resolvedParams = await params;
    post = await getPostData(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  const author = getAuthorData();
  const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`;
  const headings = extractHeadings(post.contentHtml);
  const relatedPosts = getRelatedPosts(post.slug, 3);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    description: post.description,
    url: postUrl,
    author: { 
      '@type': 'Person', 
      name: author.name,
      description: author.shortBio,
      url: author.website,
      sameAs: Object.values(author.social).filter(url => url),
      jobTitle: author.credentials.title,
      worksFor: author.credentials.company,
      knowsAbout: author.expertise
    },
    publisher: { 
      '@type': 'Organization', 
      name: author.name,
      url: author.website
    },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <Navigation />
      <main className="main">
        <div className="blog-layout">
          <article className="blog-content">
            <h1>{post.title}</h1>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            
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
            
            <AuthorBio variant="compact" showSocial={true} showCredentials={false} showExpertise={false} />
            
            <RelatedPosts posts={relatedPosts} />
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

