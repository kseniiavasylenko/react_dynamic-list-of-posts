import { CommentData, PostComment } from '../types/Comment';
import { request } from '../utils/http';

export const getPostComments = (postId: number) => {
  return request<PostComment[]>(`/comments?postId=${postId}`);
};

export const addPostComment = (comment: CommentData & { postId: number }) => {
  return request<PostComment>('/comments', 'POST', comment);
};

export const deletePostComment = (commentId: number) => {
  return request(`/comments/${commentId}`, 'DELETE');
};
