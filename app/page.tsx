import { PostsList } from '@/components/posts-list';
import { CacheInfo } from '@/components/cache-info';
import { TanStackExplainer } from '@/components/tanstack-explainer';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">TanStack Query Cache Demo</h1>
        <p className="text-muted-foreground">
          Learn how TanStack Query handles caching, data fetching, and state
          management through this interactive demo.
        </p>
      </div>

      <TanStackExplainer />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PostsList />
        </div>

        <div>
          <CacheInfo />
        </div>
      </div>
    </div>
  );
}
