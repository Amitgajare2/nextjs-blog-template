import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <ul>
            <li>
              <Link href="/">home</Link>
            </li>
            <li>
              <Link href="/blog">blog</Link>
            </li>
            <li>
            <Link href="/about">About</Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
