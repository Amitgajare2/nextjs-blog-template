import AnimatedLink from './AnimatedLink';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchQuery?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchQuery }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (page > 1) params.set('page', page.toString());
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav className="pagination">
      <div className="pagination-container">
        {currentPage > 1 && (
          <AnimatedLink href={getPageUrl(currentPage - 1)} className="pagination-link pagination-prev">
            ← Previous
          </AnimatedLink>
        )}
        
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <AnimatedLink
                key={page}
                href={getPageUrl(page as number)}
                className={`pagination-link pagination-number ${
                  page === currentPage ? 'pagination-active' : ''
                }`}
              >
                {page}
              </AnimatedLink>
            )
          ))}
        </div>
        
        {currentPage < totalPages && (
          <AnimatedLink href={getPageUrl(currentPage + 1)} className="pagination-link pagination-next">
            Next →
          </AnimatedLink>
        )}
      </div>
    </nav>
  );
}
