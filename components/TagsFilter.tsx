import AnimatedLink from './AnimatedLink';

interface TagsFilterProps {
  tags: string[];
  currentTag?: string;
  baseUrl: string;
}

export default function TagsFilter({ tags, currentTag, baseUrl }: TagsFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="tags-filter">
      <h3 className="tags-title">Filter by tags:</h3>
      <div className="tags-container">
        <AnimatedLink 
          href={baseUrl} 
          className={`tag ${!currentTag ? 'tag-active' : ''}`}
        >
          All
        </AnimatedLink>
        {tags.map((tag) => (
          <AnimatedLink
            key={tag}
            href={`${baseUrl}?tag=${encodeURIComponent(tag)}`}
            className={`tag ${currentTag === tag ? 'tag-active' : ''}`}
          >
            {tag}
          </AnimatedLink>
        ))}
      </div>
    </div>
  );
}
