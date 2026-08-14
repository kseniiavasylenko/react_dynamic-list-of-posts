import { User } from '../types/User';
import { request } from '../utils/http';

export const getUsers = () => {
  return request<User[]>('/users');
};
