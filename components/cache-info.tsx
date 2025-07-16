'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Query } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Database, CheckCircle, Info } from 'lucide-react';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

export const CacheInfo = () => {
  const queryClient = useQueryClient();
  const [isClearing, setIsClearing] = useState(false);
  const [justCleared, setJustCleared] = useState(false);
  const [queries, setQueries] = useState<Query[]>(() =>
    queryClient.getQueryCache().getAll()
  );

  // Update queries list periodically to reflect cache changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentQueries = queryClient.getQueryCache().getAll();
      setQueries(currentQueries);
    }, 1000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const clearCache = async (): Promise<void> => {
    setIsClearing(true);
    queryClient.clear();
    setQueries([]);
    setJustCleared(true);

    setTimeout(() => {
      setIsClearing(false);
      setJustCleared(false);
    }, 2000);
  };

  const getQueryAge = (query: Query): string => {
    if (!query.state.dataUpdatedAt) return 'Never';
    const ageMs = Date.now() - query.state.dataUpdatedAt;
    const ageMinutes = Math.floor(ageMs / 60000);
    const ageSeconds = Math.floor((ageMs % 60000) / 1000);

    if (ageMinutes > 0) return `${ageMinutes}m ${ageSeconds}s`;
    return `${ageSeconds}s`;
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status) {
      case 'success':
        return 'default';
      case 'loading':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cache Inspector
              </CardTitle>
              <CardDescription>
                Real-time view of TanStack Query cache
              </CardDescription>
            </div>
            <Button
              onClick={clearCache}
              variant={justCleared ? 'default' : 'outline'}
              size="sm"
              disabled={isClearing}
              className={justCleared ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {justCleared ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Cleared!
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isClearing ? 'Clearing...' : 'Clear All Cache'}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Active Queries:</span>
              <Badge
                variant="secondary"
                className={
                  queries.length === 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }
              >
                {queries.length}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Memory Usage:</span>
              <Badge variant="outline" className="text-xs">
                {queries.length > 0 ? 'Active' : 'Empty'}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Cached Queries:</span>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>

            {queries.length === 0 ? (
              <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded border border-dashed">
                <p className="text-center font-medium">No queries cached</p>
                <p className="text-xs text-center mt-1">
                  {justCleared
                    ? '✅ Cache successfully cleared!'
                    : 'Load some data to see caching in action'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {queries.map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs bg-background px-2 py-1 rounded border mb-1">
                        {JSON.stringify(query.queryKey)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Age: {getQueryAge(query)} • Updated:{' '}
                        {query.state.dataUpdatedAt
                          ? new Date(
                              query.state.dataUpdatedAt
                            ).toLocaleTimeString()
                          : 'Never'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant={getStatusColor(query.state.status)}>
                        {query.state.status}
                      </Badge>
                      {query.state.isStale && (
                        <Badge variant="outline" className="text-xs">
                          Stale
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded border">
            <p className="font-medium mb-2">Cache Configuration:</p>
            <div className="grid grid-cols-1 gap-1">
              <p>
                • <strong>Stale Time:</strong> 10 minutes (data stays fresh)
              </p>
              <p>
                • <strong>GC Time:</strong> 15 minutes (keep in memory)
              </p>
              <p>
                • <strong>Refetch:</strong> Disabled on focus/mount
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
