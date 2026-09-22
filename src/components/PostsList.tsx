// src/components/PostsList.tsx
import React from 'react';
import PropTypes from 'prop-types';
import { Post } from '../types/Post';

interface Props {
  posts: Post[];
  currentPost: Post | null;
  onPostSelect: (post: Post) => void;
}

export const PostsList: React.FC<Props> = ({
  posts,
  currentPost,
  onPostSelect,
}) => {
  return (
    <div className="block" data-cy="PostsList">
      <p className="title is-4">Posts:</p>
      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => {
            const isSelected = currentPost?.id === post.id;

            return (
              <tr
                key={post.id}
                data-cy="Post"
                className={isSelected ? 'is-selected' : ''}
              >
                <td data-cy="PostId">{post.id}</td>
                <td data-cy="PostTitle">{post.title}</td>
                <td className="has-text-right is-vcentered">
                  <button
                    type="button"
                    className={`button is-link ${isSelected ? '' : 'is-light'}`}
                    data-cy="PostButton"
                    onClick={() => onPostSelect(post)}
                  >
                    {isSelected ? 'Close' : 'Open'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

PostsList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  currentPost: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }),
  onPostSelect: PropTypes.func.isRequired,
};
