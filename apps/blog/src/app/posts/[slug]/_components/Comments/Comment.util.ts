import type { NotionPage } from '@/models/notion';
import type { CommentProps } from './Comment';

export function convertToCommentProps(comment: NotionPage): CommentProps {
  return {
    id: comment.id,
    author: comment.properties.Author.rich_text[0].plain_text,
    content: comment.properties.Comment.title[0].plain_text,
    createdAt: comment.properties.CreatedAt.created_time,
    liked: comment.properties.Liked.checkbox,
    owner: comment.properties.Owner.checkbox,
    avatar: comment.properties.Avatar.url,
  };
}

export const getAvatarUrl = () => {
  const styles = ['adventurer', 'avataaars', 'bottts', 'personas'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const randomSeed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/6.x/${randomStyle}/svg?seed=${randomSeed}`;
};
