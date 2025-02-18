import { generateHomeMetadata } from '@/lib/meta';
import { ProfileCard } from '@/app/_components/ProfileCard';
import type { Metadata } from 'next';
import PostSection from './_components/PostSection';
import QueryHydrationBoundary from '@/components/QueryHydrationBoundary';
import { PostQueryOptions } from '@/hooks/post';

export const generateMetadata = async (): Promise<Metadata> => {
  return generateHomeMetadata();
};

export const revalidate = 3600;

export default async function HomePage() {
  return (
    <main className={'flex flex-col mx-auto gap-4 min-h-screen'}>
      <ProfileCard />
      <QueryHydrationBoundary queryOptions={PostQueryOptions.getInfinitePosts({})} isInfiniteQuery={true}>
        <PostSection />
      </QueryHydrationBoundary>
    </main>
  );
}
