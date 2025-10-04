import Navigation from '../components/Navigation';
import { getPostsSummary } from '../utils/blog';
import Link from 'next/link';

export default async function Home() {
  const posts = getPostsSummary().slice(0, 3); // Show only the 3 most recent posts

  return (
    <>
      <Navigation />
      <main className="main">
        <div className="container">
          <h1 className="title">Unfiltered Mind</h1>
          <p className="subtitle">
            a political blog that cuts through the noise. No PR talk, no paid narrative - just raw optinions, facts, and fearless satire straight from a common man's mind. here, every post questions the system, mocks the propaganda, and celebrates free thinking.
          </p>
          
          <ul className="blog-posts">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="blog-post-link">
                  <span className="blog-post-date">{post.date}</span>
                  <span className="blog-post-title">{post.title}</span>
                </Link>
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
