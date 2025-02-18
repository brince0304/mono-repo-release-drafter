import { notionClient } from '@/lib/notion/notion';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: '페이지 ID가 존재하지 않습니다.' }, { status: 400 });
  }

  try {
    const response = await notionClient.getPageBySlug(slug);
    const isPublished = response?.page?.properties?.Published?.checkbox ?? false;

    if (!isPublished || !response) {
      return NextResponse.json({ error: '게시글이 존재하지 않습니다.' }, { status: 404 });
    }

    return NextResponse.json({ ...response });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: '게시글 조회에 실패하였습니다.' }, { status: 500 });
  }
}
