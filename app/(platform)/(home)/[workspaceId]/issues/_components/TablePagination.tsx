import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/components/catalyst/pagination';

export function TablePagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  createPageUrl,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  createPageUrl: (pageNum: number) => string;
}) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination aria-label="Page navigation" className="mt-6">
      <PaginationPrevious
        aria-disabled={!hasPreviousPage}
        className={!hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
        href={hasPreviousPage ? createPageUrl(currentPage - 1) : '#'}
      >
        Previous
      </PaginationPrevious>
      <PaginationList>
        {pageNumbers.map((pageNum) => (
          <PaginationPage
            key={pageNum}
            current={currentPage === pageNum}
            href={createPageUrl(pageNum)}
          >
            {pageNum}
          </PaginationPage>
        ))}
      </PaginationList>
      <PaginationNext
        aria-disabled={!hasNextPage}
        className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
        href={hasNextPage ? createPageUrl(currentPage + 1) : '#'}
      >
        Next
      </PaginationNext>
    </Pagination>
  );
}