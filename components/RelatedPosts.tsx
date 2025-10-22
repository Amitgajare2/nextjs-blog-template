import AnimatedLink from './AnimatedLink';
import { BlogPostSummary } from '../utils/blog';

interface RelatedPostsProps {
  posts: BlogPostSummary[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="related-posts">
      <h2>Related Posts</h2>
      <ul className="related-posts-list">
        {posts.map((post) => (
          <li key={post.slug} className="related-post-item">
            <AnimatedLink href={`/blog/${post.slug}`} className="related-post-link">
              <div className="related-post-meta">
                <span className="related-post-date">{post.date}</span>
                {post.readTime && <span>• {post.readTime}</span>}
              </div>
              <h3 className="related-post-title">{post.title}</h3>
              {post.description && (
                <p className="related-post-description">{post.description}</p>
              )}
              {post.tags && (
                <div className="related-post-tags">
                  {post.tags.split(',').map((tag, index) => (
                    <span key={index} className="related-post-tag">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </AnimatedLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
