import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ScrollableCardListProps {
  children: React.ReactNode;
}

export function ScrollableCardList({ children }: ScrollableCardListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 400;
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      let targetScroll: number;
      
      if (direction === 'left') {
        // 左端にいる場合は右端にループ
        if (currentScroll <= 0) {
          targetScroll = maxScroll;
        } else {
          targetScroll = currentScroll - scrollAmount;
        }
      } else {
        // 右端にいる場合は左端にループ
        if (currentScroll >= maxScroll - 10) { // 10pxの余裕を持たせる
          targetScroll = 0;
        } else {
          targetScroll = currentScroll + scrollAmount;
        }
      }
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group w-full overflow-hidden">
      {/* 左スクロールボタン */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground shadow-lg"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* スクロール可能なカードコンテナ */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-scroll scrollbar-hide scroll-smooth pb-2 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>

      {/* 右スクロールボタン */}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm border-border hover:bg-primary hover:text-primary-foreground shadow-lg"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}