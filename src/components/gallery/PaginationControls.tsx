
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem 
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PaginationControls = ({ 
  page, 
  totalPages, 
  onPreviousPage, 
  onNextPage 
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mb-8">
      <PaginationContent>
        <PaginationItem>
          <Button 
            onClick={onPreviousPage} 
            disabled={page === 1}
            variant="outline"
            size="sm"
            className="gap-1 pl-2.5"
          >
            <span className="flex items-center">
              <span className="mr-1">←</span> 上一页
            </span>
          </Button>
        </PaginationItem>
        <PaginationItem className="px-4">
          第 {page} 页，共 {totalPages} 页
        </PaginationItem>
        <PaginationItem>
          <Button 
            onClick={onNextPage} 
            disabled={page === totalPages}
            variant="outline"
            size="sm"
            className="gap-1 pr-2.5"
          >
            <span className="flex items-center">
              下一页 <span className="ml-1">→</span>
            </span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
