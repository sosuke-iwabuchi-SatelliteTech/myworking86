import { Link } from '@/types/pagination';
import { InertiaLinkProps, Link as InertiaLink } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    links: Link[];
}

export function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1">
            {links.map((link, i) => {
                if (link.url === null) {
                    return (
                        <Button
                            key={i}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground cursor-default hover:bg-transparent"
                            disabled
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        </Button>
                    );
                }

                // Previous / Next icons replacement
                let label = link.label;
                let Icon = null;

                if (link.label.includes('&laquo;')) {
                    Icon = ChevronLeft;
                    label = '';
                } else if (link.label.includes('&raquo;')) {
                    Icon = ChevronRight;
                    label = '';
                } else {
                    // Strip HTML entities for numbers
                    label = link.label;
                }

                return (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        size="icon"
                        className={cn("h-8 w-8", link.active && "pointer-events-none")}
                        asChild
                    >
                        <InertiaLink
                            href={link.url}
                            preserveScroll
                            preserveState
                        >
                            {Icon ? <Icon className="h-4 w-4" /> : <span dangerouslySetInnerHTML={{ __html: label }}></span>}
                        </InertiaLink>
                    </Button>
                );
            })}
        </div>
    );
}
