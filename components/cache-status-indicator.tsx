'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, Clock, Database, Zap } from 'lucide-react';

interface CacheStatusProps {
  isLoading: boolean;
  isFetching: boolean;
  dataUpdatedAt: number | undefined;
  error: unknown;
}

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

interface StatusInfo {
  text: string;
  color: BadgeVariant;
  icon: typeof Wifi;
}

export const CacheStatusIndicator = ({
  isLoading,
  isFetching,
  dataUpdatedAt,
  error,
}: CacheStatusProps) => {
  const [mounted, setMounted] = useState(false);

  // Calculate if data is stale (older than 10 minutes)
  const isStale = dataUpdatedAt
    ? Date.now() - dataUpdatedAt > 10 * 60 * 1000
    : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatus = (): StatusInfo => {
    if (error) return { text: 'Error', color: 'destructive', icon: WifiOff };
    if (isLoading)
      return { text: 'Initial Load', color: 'secondary', icon: Wifi };
    if (isFetching) return { text: 'Refetching', color: 'default', icon: Wifi };
    if (isStale)
      return { text: 'Stale (>10min)', color: 'outline', icon: Clock };
    return { text: 'Fresh (<10min)', color: 'default', icon: Zap };
  };

  const status = getStatus();
  const Icon = status.icon;

  const timeSinceUpdate =
    mounted && dataUpdatedAt
      ? Math.floor((Date.now() - dataUpdatedAt) / 1000)
      : 0;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="h-4 w-4" />
          TanStack Query Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Data Source:</span>
          <Badge variant={status.color} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {status.text}
          </Badge>
        </div>

        {mounted && dataUpdatedAt && dataUpdatedAt > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Fetched:</span>
            <span className="text-sm text-muted-foreground">
              {formatTime(timeSinceUpdate)}
            </span>
          </div>
        )}

        <div className="text-xs bg-muted/50 p-2 rounded space-y-1">
          <div className="flex justify-between">
            <span>Fresh Duration:</span>
            <span className="font-mono">10 minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Cache Expiry:</span>
            <span className="font-mono">15 minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Network Calls:</span>
            <span className="font-mono">
              {isFetching || isLoading ? 'Active' : 'None'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
