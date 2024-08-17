'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationList,
  PaginationPage,
  PaginationGap,
} from '@/components/catalyst/pagination';

export default function PaginationClient({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const paginationPages = generatePaginationPages(currentPage, totalPages);

  return (
    <Pagination className="mt-6">
      <PaginationPrevious
        onClick={() =>
          router.push(`?${createQueryString('page', String(currentPage - 1))}`)
        }
        disabled={currentPage === 1}
      />
      <PaginationList>
        {paginationPages.map((page, index) =>
          page === 'gap' ? (
            <PaginationGap key={`gap-${index}`} />
          ) : (
            <PaginationPage
              key={page}
              onClick={() =>
                router.push(`?${createQueryString('page', String(page))}`)
              }
              current={currentPage === page}
            >
              {page}
            </PaginationPage>
          ),
        )}
      </PaginationList>
      <PaginationNext
        onClick={() =>
          router.push(`?${createQueryString('page', String(currentPage + 1))}`)
        }
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
}

function generatePaginationPages(currentPage: number, totalPages: number) {
  let pages = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    pages = [1];

    if (currentPage > 3) {
      pages.push('gap');
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('gap');
    }

    pages.push(totalPages);
  }

  return pages;
}
