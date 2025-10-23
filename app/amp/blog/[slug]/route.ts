import { NextResponse } from 'next/server';
import { getPostData } from '../../../../utils/blog';

function toAmpHtml(html: string): string {
  let amp = html;

  // Remove disallowed tags
  amp = amp.replace(/<script[\s\S]*?<\/script>/gi, '');
  amp = amp.replace(/on\w+="[^"]*"/gi, '');

  // Convert img to amp-img with safe defaults if width/height missing
  amp = amp.replace(/<img([^>]*)>/gi, (_match, attrs) => {
    let newAttrs = attrs;
    // Ensure alt exists
    if (!/\balt\s*=/.test(newAttrs)) newAttrs += ' alt=""';
    // Extract width/height if present
    const widthMatch = newAttrs.match(/\bwidth\s*=\s*"(\d+)"/i);
    const heightMatch = newAttrs.match(/\bheight\s*=\s*"(\d+)"/i);
    const width = widthMatch ? widthMatch[1] : '800';
    const height = heightMatch ? heightMatch[1] : '450';
    // Remove loading/decoding which are not needed in AMP
    newAttrs = newAttrs.replace(/\bloading\s*=\s*"[^"]*"/gi, '');
    newAttrs = newAttrs.replace(/\bdecoding\s*=\s*"[^"]*"/gi, '');
    return `<amp-img${newAttrs} width="${width}" height="${height}" layout="responsive"></amp-img>`;
  });

  // Convert iframe to amp-iframe
  amp = amp.replace(/<iframe([^>]*)>([\s\S]*?)<\/iframe>/gi, (_m, attrs) => {
    // Provide defaults
    const widthMatch = attrs.match(/\bwidth\s*=\s*"(\d+)"/i);
    const heightMatch = attrs.match(/\bheight\s*=\s*"(\d+)"/i);
    const width = widthMatch ? widthMatch[1] : '800';
    const height = heightMatch ? heightMatch[1] : '450';
    // sandbox and resizable per AMP spec
    return `<amp-iframe${attrs} width="${width}" height="${height}" sandbox="allow-scripts allow-same-origin" layout="responsive"></amp-iframe>`;
  });

  // Video -> amp-video (basic)
  amp = amp.replace(/<video([^>]*)>([\s\S]*?)<\/video>/gi, (_m, attrs, inner) => {
    const widthMatch = attrs.match(/\bwidth\s*=\s*"(\d+)"/i);
    const heightMatch = attrs.match(/\bheight\s*=\s*"(\d+)"/i);
    const width = widthMatch ? widthMatch[1] : '800';
    const height = heightMatch ? heightMatch[1] : '450';
    return `<amp-video${attrs} width="${width}" height="${height}" layout="responsive">${inner}</amp-video>`;
  });

  return amp;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  const ampContent = toAmpHtml(post.contentHtml);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const postUrl = `${baseUrl}/amp/blog/${post.slug}`;

  const html = `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
    <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>
    <title>${post.title}</title>
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <meta name="description" content="${post.description || ''}">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>
      body { font-family: Arial, sans-serif; line-height: 1.6; padding: 16px; color: #111; }
      .container { max-width: 760px; margin: 0 auto; }
      h1 { font-size: 28px; margin: 0 0 12px; }
      .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
      .content p { margin: 0 0 16px; }
      .tag { display: inline-block; padding: 2px 8px; border: 1px solid #ddd; border-radius: 999px; font-size: 12px; margin-right: 6px; }
    </style>
  </head>
  <body>
    <main class="container">
      <article>
        <h1>${post.title}</h1>
        <div class="meta">${post.date}${post.readTime ? ` • ${post.readTime}` : ''}</div>
        ${post.tags ? `<div>${post.tags.split(',').map(t => `<span class=\"tag\">${t.trim()}</span>`).join('')}</div>` : ''}
        <div class="content">${ampContent}</div>
      </article>
    </main>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
      'Link': `<${canonicalUrl}>; rel="canonical", <${postUrl}>; rel="amphtml"`,
    },
  });
}


