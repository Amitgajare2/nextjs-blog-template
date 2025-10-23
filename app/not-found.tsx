import Navigation from '../components/Navigation';
import AnimatedLink from '../components/AnimatedLink';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="main">
        <div className="container">
          <h1 className="title">404 - Page Not Found</h1>
          <p className="subtitle">
            The page you&apos;re looking for doesn&apos;t exist. 
            <AnimatedLink href="/" className="" >
              Return home
            </AnimatedLink> or check out the 
            <AnimatedLink href="/blog" className="" >
              blog
            </AnimatedLink>.
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
