'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPosts, fetchUser } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CacheStatusIndicator } from '@/components/cache-status-indicator';

const UserBadge = ({ userId }: { userId: number }) => {
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  if (isLoading) {
    return <Skeleton className="h-5 w-20" />;
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {isFetching && (
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
      )}
      <Users className="h-3 w-3" />
      {user?.name || 'Unknown'}
    </Badge>
  );
};

export function PostsList() {
  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
    isStale,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  if (error) {
    return (
      <div>
        <CacheStatusIndicator
          isLoading={isLoading}
          isFetching={isFetching}
          isStale={isStale}
          dataUpdatedAt={dataUpdatedAt}
          error={error}
        />
        <Alert variant="destructive" className="border-red-800 bg-red-950/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load posts. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CacheStatusIndicator
        isLoading={isLoading}
        isFetching={isFetching}
        isStale={isStale}
        dataUpdatedAt={dataUpdatedAt}
        error={error}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Posts Data</h3>
          {isFetching && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-blue-500">Fetching...</span>
            </div>
          )}
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
          />
          {isFetching ? 'Refreshing...' : 'Force Refresh'}
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          : posts?.slice(0, 8).map(post => (
              <Card key={post.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">
                      {post.title}
                    </CardTitle>
                    <UserBadge userId={post.userId} />
                  </div>
                  <CardDescription>Post #{post.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.body}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {posts && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {Math.min(8, posts.length)} of {posts.length} posts
        </div>
      )}
    </div>
  );
}
