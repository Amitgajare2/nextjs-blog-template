import { NextResponse } from 'next/server';
import { getPostsSummary } from '../../utils/blog';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const posts = getPostsSummary();

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const description = post.description || '';
      return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${description}]]></description>
      </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>unfilteredmind</title>
      <link>${baseUrl}</link>
      <description>For those who read between the lies.</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

