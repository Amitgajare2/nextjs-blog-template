interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialShare({ title, url, description }: SocialShareProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    // email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div className="social-share">
      <h4 className="share-title">Share this article:</h4>
      <div className="share-links">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="share-link share-twitter"
          aria-label="Share on Twitter"
        >
          Twitter
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="share-link share-facebook"
          aria-label="Share on Facebook"
        >
          Facebook
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="share-link share-linkedin"
          aria-label="Share on LinkedIn"
        >
          LinkedIn
        </a>
        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="share-link share-reddit"
          aria-label="Share on Reddit"
        >
          Reddit
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="share-link share-whatsapp"
          aria-label="Share on WhatsApp"
        >
          WhatsApp
        </a>
        {/* <a
          href={shareLinks.email}
          className="share-link share-email"
          aria-label="Share via Email"
        >
          Email
        </a> */}
      </div>
    </div>
  );
}
