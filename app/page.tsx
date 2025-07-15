import { PostsList } from '@/components/posts-list';
import { CacheInfo } from '@/components/cache-info';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">TanStack Query Cache Demo</h1>
        <p className="text-muted-foreground">
          This app demonstrates TanStack Query with 10-minute caching. Data is
          fetched from JSONPlaceholder API and cached for 10 minutes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>
          <PostsList />
        </div>

        <div>
          <CacheInfo />
        </div>
      </div>
    </div>
  );
}
