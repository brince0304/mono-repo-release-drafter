import { serverFetcher } from '@/lib/client';
import { generateBlogPostMetadata, generateMetadata as generateDefaultMetadata } from '@/lib/meta';
import { notionClient } from '@/lib/notion/notion';
import type { NotionPage, PageBySlugResponse } from '@/models/notion';
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostDetail from './_components/PostDetail/PostDetail';

export async function generateMetadata({
  params,
}: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await serverFetcher<PageBySlugResponse>(`/posts/${params.slug}`);

    if (!article?.page) {
      throw new Error('Post not found');
    }

    return generateBlogPostMetadata(article.page);
  } catch (error) {
    console.error(`Failed to generate metadata for slug: ${params.slug}`, error);
    return generateDefaultMetadata({
      title: '페이지를 찾을 수 없습니다',
      description: '요청하신 게시글을 찾을 수 없습니다.',
    });
  }
}

export async function generateStaticParams() {
  const articles = await serverFetcher<QueryDatabaseResponse>('/posts');
  const results = articles.results as NotionPage[];

  return results.map((article) => ({
    slug: article.properties?.Slug?.rich_text[0]?.plain_text,
  }));
}

export const revalidate = 3600;

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await notionClient.getPageBySlug(params.slug);
  let seriesPosts: NotionPage[] = [];

  if (post?.page.properties.Series) {
    const seriesResponse = await notionClient.getPostsByParams({
      series: post.page.properties.Series.select?.name,
    });
    seriesPosts =
      seriesResponse?.results.filter((page): page is NotionPage => 'properties' in page) ?? [];

    seriesPosts.sort((a, b) => {
      const aIndex = a.properties.SeriesNumber.number;
      const bIndex = b.properties.SeriesNumber.number;
      return aIndex - bIndex;
    });
  }

  if (!post?.page.properties.Published.checkbox) {
    notFound();
  }

  return (
    <div className="flex sm:mt-4 mt-5">
      <PostDetail post={post as PageBySlugResponse} seriesPosts={seriesPosts} />
    </div>
  );
}
