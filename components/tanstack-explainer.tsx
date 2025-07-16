'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, Target, Timer } from 'lucide-react';

export const TanStackExplainer = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          TanStack Query Learning Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">What is TanStack Query?</h4>
              <p className="text-xs text-muted-foreground">
                A data fetching library that handles caching, synchronization,
                and server state management automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Timer className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Caching Behavior</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  •{' '}
                  <Badge variant="outline" className="text-xs">
                    Fresh
                  </Badge>{' '}
                  Data is recent, no network call needed
                </p>
                <p>
                  •{' '}
                  <Badge variant="secondary" className="text-xs">
                    Stale
                  </Badge>{' '}
                  Data is old but usable, refetch in background
                </p>
                <p>
                  •{' '}
                  <Badge variant="destructive" className="text-xs">
                    Loading
                  </Badge>{' '}
                  No data, making initial network call
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Try This:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>1. Refresh the page - notice the loading state</p>
                <p>
                  2. Refresh again within 10 minutes - data loads instantly from
                  cache!
                </p>
                <p>3. Clear cache and see the difference</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
