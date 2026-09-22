// src/components/PostDetails.tsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Post } from '../types/Post';
import { PostComment, CommentData } from '../types/Comment';
import {
  getPostComments,
  addComment,
  deleteComment,
} from '../services/comments.service';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

interface Props {
  post: Post;
}

export const PostDetails: React.FC<Props> = ({ post }) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setComments([]);
    setShowForm(false);
    setError(false);

    // Перевірка: якщо пост не обраний або id відсутній — запит НЕ робимо
    if (!post || !post.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getPostComments(post.id)
      .then(setComments)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [post.id]);

  const handleAddComment = async (commentData: CommentData) => {
    setError(false);

    try {
      const newComment = await addComment({
        ...commentData,
        postId: post.id,
      });

      setComments(prev => [...prev, newComment]);
    } catch (err) {
      setError(true);
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setError(false);
    const previousComments = [...comments];

    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      await deleteComment(commentId);
    } catch {
      setComments(previousComments);
      setError(true);
    }
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">{post.title}</h2>
        <p data-cy="PostBody">{post.body}</p>
      </div>

      <div className="block">
        {isLoading && <Loader />}

        {!isLoading && error && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong!
          </div>
        )}

        {!isLoading && !error && comments.length === 0 && (
          <div className="notification is-warning" data-cy="NoComments">
            No comments yet
          </div>
        )}

        {!isLoading &&
          comments.length > 0 &&
          comments.map(comment => (
            <article
              className="message is-small"
              key={comment.id}
              data-cy="Comment"
            >
              <div className="message-header">
                <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                  {comment.name}
                </a>
                <button
                  type="button"
                  className="delete is-small"
                  aria-label="delete"
                  onClick={() => handleDeleteComment(comment.id)}
                  data-cy="CommentDelete"
                />
              </div>
              <div className="message-body" data-cy="CommentBody">
                {comment.body}
              </div>
            </article>
          ))}

        {!isLoading && !showForm && (
          <button
            type="button"
            className="button is-link"
            onClick={() => setShowForm(true)}
            data-cy="WriteCommentButton"
          >
            Write a comment
          </button>
        )}

        {!isLoading && showForm && (
          <NewCommentForm
            key={post.id}
            postId={post.id}
            onAddComment={handleAddComment}
          />
        )}
      </div>
    </div>
  );
};

PostDetails.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};
