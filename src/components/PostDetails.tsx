import React, { useEffect, useState } from 'react';
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
    if (!post?.id) {
      return;
    }

    setIsLoading(true);
    setError(false);
    setShowForm(false);

    getPostComments(post.id)
      .then(setComments)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [post.id]);

  const handleAddComment = async (commentData: CommentData) => {
    const newComment = await addComment(commentData);

    setComments(prev => [...prev, newComment]);
  };

  const handleDeleteComment = async (commentId: number) => {
    const previousComments = [...comments];

    // Optimistic UI: удаляем сразу
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      await deleteComment(commentId);
    } catch {
      // При ошибке откатываем изменения обратно
      setComments(previousComments);
    }
  };

  return (
    <div className="content">
      <div className="block">
        <h2>{post.title}</h2>
        <p>{post.body}</p>
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
          !error &&
          comments.length > 0 &&
          comments.map(comment => (
            <article
              className="message is-small"
              key={comment.id}
              data-cy="Comment"
            >
              <div className="message-header">
                <p>{comment.name}</p>
                <button
                  type="button"
                  className="delete is-small"
                  aria-label="delete"
                  onClick={() => handleDeleteComment(comment.id)}
                  data-cy="CommentDelete"
                />
              </div>
              <div className="message-body">{comment.body}</div>
            </article>
          ))}

        {!isLoading && !error && !showForm && (
          <button
            type="button"
            className="button is-link"
            onClick={() => setShowForm(true)}
            data-cy="WriteCommentButton"
          >
            Write a comment
          </button>
        )}

        {!isLoading && !error && showForm && (
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
