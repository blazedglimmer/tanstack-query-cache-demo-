'use client';

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
import { Trash2, Database } from 'lucide-react';

export const CacheInfo = () => {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();

  const clearCache = () => {
    queryClient.clear();
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
          <Button onClick={clearCache} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Active Queries:</span>
          <Badge variant="secondary">{queries.length}</Badge>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Cached Queries:</span>
          {queries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No queries cached</p>
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
