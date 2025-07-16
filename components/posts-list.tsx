'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, fetchUser } from '@/lib/api';
import type { Post } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Users, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CacheStatusIndicator } from './cache-status-indicator';

interface UserBadgeProps {
  userId: number;
}

const UserBadge = ({ userId }: UserBadgeProps) => {
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

export const PostsList = () => {
  const queryClient = useQueryClient();

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

  // Function to invalidate and refetch (respects cache)
  const handleSmartRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  // Function to force refetch (bypasses cache)
  const handleForceRefresh = () => {
    refetch();
  };

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

        <div className="flex gap-2">
          <Button
            onClick={handleSmartRefresh}
            disabled={isFetching}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent"
          >
            <RotateCcw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            Smart Refresh
          </Button>

          <Button
            onClick={handleForceRefresh}
            disabled={isFetching}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            Force Refresh
          </Button>
        </div>
      </div>

      {/* Explanation of button differences */}
      <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-3 rounded border border-blue-200 dark:border-blue-800">
        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
          Button Differences:
        </p>
        <p className="text-blue-700 dark:text-blue-300">
          • <strong>Smart Refresh:</strong> Respects cache - only fetches if
          data is stale ({'>'} 10 minutes old)
        </p>
        <p className="text-blue-700 dark:text-blue-300">
          • <strong>Force Refresh:</strong> Always makes network call, ignoring
          cache
        </p>
        <p className="text-blue-700 dark:text-blue-300 mt-1">
          💡 <strong>Try this:</strong> Use Smart Refresh within 10 minutes - no
          network call!
        </p>
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
          : posts?.slice(0, 8).map((post: Post) => (
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
};
