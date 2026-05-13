export default function Skeleton({ className = '', rounded = 'rounded' }) {
  return <div className={`shimmer-bg animate-shimmer ${rounded} ${className}`} />;
}

export function CourseCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4 min-h-[180px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-20" rounded="rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-line">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
