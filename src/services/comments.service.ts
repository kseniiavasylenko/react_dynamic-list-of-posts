import { client } from '../utils/fetchClient';
import { PostComment, CommentData } from '../types/Comment';

export const getPostComments = (postId: number): Promise<PostComment[]> => {
  // Строгая проверка: если postId нет, не число или <= 0 — вызов API заблокирован
  if (!postId || typeof postId !== 'number' || postId <= 0) {
    return Promise.resolve([]);
  }

  return client.get<PostComment[]>(`/comments?postId=${postId}`);
};

export const addComment = (data: CommentData) => {
  return client.post<PostComment>('/comments', data);
};

export const deleteComment = (commentId: number) => {
  return client.delete(`/comments/${commentId}`);
};
