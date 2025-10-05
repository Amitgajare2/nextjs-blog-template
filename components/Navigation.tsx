import AnimatedLink from './AnimatedLink';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <ul>
            <li>
              <AnimatedLink href="/">home</AnimatedLink>
            </li>
            <li>
              <AnimatedLink href="/blog">blog</AnimatedLink>
            </li>
            <li>
            <AnimatedLink href="/about">About</AnimatedLink>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
