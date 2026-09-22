import { client } from '../utils/fetchClient';
import { PostComment, CommentData } from '../types/Comment';

export const getPostComments = (postId: number) => {
  return client.get<PostComment[]>(`/comments?postId=${postId}`);
};

export const addComment = (data: CommentData) => {
  return client.post<PostComment>('/comments', data);
};

export const deleteComment = (commentId: number) => {
  return client.delete(`/comments/${commentId}`);
};
