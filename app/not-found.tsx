import Navigation from '../components/Navigation';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="main">
        <div className="container">
          <h1 className="title">404 - Page Not Found</h1>
          <p className="subtitle">
            The page you're looking for doesn't exist. 
            <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              Return home
            </Link> or check out the 
            <Link href="/blog" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              blog
            </Link>.
          </p>
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
