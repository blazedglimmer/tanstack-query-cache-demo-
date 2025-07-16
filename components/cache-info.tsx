'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Database, CheckCircle } from 'lucide-react';

export const CacheInfo = () => {
  const queryClient = useQueryClient();
  const [isClearing, setIsClearing] = useState(false);
  const [justCleared, setJustCleared] = useState(false);
  const [queries, setQueries] = useState(() =>
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

  const clearCache = async () => {
    setIsClearing(true);

    // Clear the cache
    queryClient.clear();

    // Update the queries list immediately
    setQueries([]);

    // Show success feedback
    setJustCleared(true);

    // Reset states after a delay
    setTimeout(() => {
      setIsClearing(false);
      setJustCleared(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cache Information
            </CardTitle>
            <CardDescription>
              TanStack Query cache status and controls
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
                {isClearing ? 'Clearing...' : 'Clear Cache'}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Active Queries:</span>
          <Badge
            variant="secondary"
            className={
              queries.length === 0
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : ''
            }
          >
            {queries.length}
          </Badge>
          {queries.length === 0 && (
            <span className="text-xs text-muted-foreground">
              (Cache is empty)
            </span>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Cached Queries:</span>
          {queries.length === 0 ? (
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border border-dashed">
              <p className="text-center">No queries cached</p>
              <p className="text-xs text-center mt-1">
                {justCleared ? 'Cache successfully cleared!' : 'Cache is empty'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {queries.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-mono text-xs bg-muted/80 px-2 py-1 rounded border">
                    {JSON.stringify(query.queryKey)}
                  </span>
                  <Badge
                    variant={
                      query.state.status === 'success' ? 'default' : 'secondary'
                    }
                  >
                    {query.state.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded border">
          <p className="font-medium mb-1">Cache Configuration:</p>
          <p>• Stale Time: 10 minutes</p>
          <p>• Garbage Collection Time: 10 minutes</p>
          <p>• Refetch on window focus: Disabled</p>
        </div>
      </CardContent>
    </Card>
  );
};
