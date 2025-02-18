import {
  BLOG_AUTHOR,
  BLOG_DESCRIPTION,
  BLOG_IMAGE_URL,
  BLOG_KEYWORDS,
  BLOG_TITLE,
  BLOG_URL,
} from '@/lib/consts';
import type { NotionPage } from '@/models/notion';
import type { Metadata } from 'next';
import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

interface MetadataBase {
  title: string;
  description: string;
  keywords: string;
  url: string;
  imageUrl: string;
}

interface SchemaOrgArticle {
  '@context': string;
  '@type': string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': string;
    name: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  keywords?: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
}

interface GenerateMetadataOptions extends Partial<MetadataBase> {
  author?: string;
  type?: 'website' | 'article';
  canonicalUrl?: string;
  openGraph?: OpenGraph;
  schema?: SchemaOrgArticle;
}

// 기본값을 상수로 분리
const DEFAULT_METADATA: MetadataBase = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  keywords: BLOG_KEYWORDS,
  url: BLOG_URL,
  imageUrl: BLOG_IMAGE_URL,
};

// 핵심 메타데이터 생성 함수
export function generateMetadata({
  title = DEFAULT_METADATA.title,
  description = DEFAULT_METADATA.description,
  keywords = DEFAULT_METADATA.keywords,
  author = BLOG_AUTHOR,
  type = 'website',
  imageUrl = DEFAULT_METADATA.imageUrl,
  url = DEFAULT_METADATA.url,
  canonicalUrl,
  openGraph,
  schema,
}: GenerateMetadataOptions = {}): Metadata {
  const finalTitle = title === BLOG_TITLE ? title : `${title} | ${BLOG_TITLE}`;
  const finalUrl = canonicalUrl || url;

  return {
    title: finalTitle,
    description,
    keywords,
    authors: [{ name: author }],
    publisher: author,
    creator: author,
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      apple: [{ url: '/apple-touch-icon.png' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: finalTitle,
      description,
      url: finalUrl,
      siteName: BLOG_TITLE,
      locale: 'ko_KR',
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: finalTitle,
        },
      ],
      creator: `@${author}`,
      site: `@${author}`,
    },
    alternates: {
      canonical: finalUrl,
      languages: {
        'ko-KR': finalUrl,
      },
    },
    other: schema
      ? {
          'script:ld+json': JSON.stringify(schema),
        }
      : {},
  };
}

export function generateBlogPostMetadata(post: NotionPage): Metadata {
  if (!post?.properties) {
    return generateMetadata();
  }

  const publishedTime = post.properties.Date?.date?.start;
  const modifiedTime = post.properties.Date?.date?.start;
  const title = post.properties.Title?.title[0]?.plain_text || DEFAULT_METADATA.title;
  const description = post.properties.Excerpt?.rich_text[0]?.plain_text || '';
  const tags = post.properties.Tags?.multi_select?.map((tag) => tag.name) || [];
  const slug = post.properties.Slug?.rich_text[0]?.plain_text;
  const imageUrl = post.properties.Thumbnail?.url || DEFAULT_METADATA.imageUrl;
  const postUrl = `${BLOG_URL}/posts/${slug}`;

  const schema: SchemaOrgArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: BLOG_AUTHOR,
    },
    publisher: {
      '@type': 'Organization',
      name: BLOG_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: `${BLOG_URL}/icon.svg`,
      },
    },
    keywords: tags.join(','),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  return generateMetadata({
    title,
    description,
    keywords: tags.join(', ') || DEFAULT_METADATA.keywords,
    url: postUrl,
    canonicalUrl: postUrl,
    imageUrl,
    type: 'article',
    openGraph: {
      type: 'article',
      authors: [BLOG_AUTHOR],
      publishedTime,
      modifiedTime,
      tags,
      section: post.properties.Category?.select?.name || 'Blog',
    },
    schema,
  });
}

// 특정 페이지 메타데이터 생성 함수들
export const generateHomeMetadata = () => generateMetadata();

export const generatePostsMetadata = () =>
  generateMetadata({
    title: '게시글 목록',
    description: BLOG_DESCRIPTION,
    url: `${BLOG_URL}/posts`,
    canonicalUrl: `${BLOG_URL}/posts`,
  });

export const generateSeriesMetadata = () =>
  generateMetadata({
    title: '포스트 시리즈',
    description: BLOG_DESCRIPTION,
    url: `${BLOG_URL}/series`,
    canonicalUrl: `${BLOG_URL}/series`,
  });
