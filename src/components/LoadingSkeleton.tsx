import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: 'video-card' | 'summary' | 'history' | 'upload';
  count?: number;
}

const LoadingSkeleton = ({ type = 'video-card', count = 1 }: LoadingSkeletonProps) => {
  const renderVideoCardSkeleton = () => (
    <Card className="p-6 space-y-4 animate-pulse">
      <div className="flex space-x-4">
        <Skeleton className="h-20 w-32 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </Card>
  );

  const renderSummarySkeleton = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex space-x-6">
          <Skeleton className="aspect-video w-1/3 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
              <div className="space-y-2 ml-11">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderHistorySkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="aspect-video w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderUploadSkeleton = () => (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg border-2 border-dashed" />
        </div>
      </div>
    </Card>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'summary':
        return renderSummarySkeleton();
      case 'history':
        return renderHistorySkeleton();
      case 'upload':
        return renderUploadSkeleton();
      default:
        return renderVideoCardSkeleton();
    }
  };

  if (type === 'video-card' && count > 1) {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i}>{renderVideoCardSkeleton()}</div>
        ))}
      </div>
    );
  }

  return <div>{renderSkeleton()}</div>;
};

export default LoadingSkeleton;