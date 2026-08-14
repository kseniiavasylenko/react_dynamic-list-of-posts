import { Post } from '../types/Post';
import { request } from '../utils/http';

export const getPosts = (userId: number) => {
  return request<Post[]>(`/posts?userId=${userId}`);
};
