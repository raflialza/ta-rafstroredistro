import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse h-full">
          <CardHeader className="gap-2">
            {/* Title Skeleton */}
            <div className="h-6 w-2/3 bg-muted rounded-md" />
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Description Skeletons */}
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-4/5 bg-muted rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
