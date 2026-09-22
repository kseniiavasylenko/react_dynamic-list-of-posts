// src/components/NewCommentForm.tsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CommentData } from '../types/Comment';

interface Props {
  postId: number;
  onAddComment: (comment: CommentData) => Promise<void>;
}

export const NewCommentForm: React.FC<Props> = ({ postId, onAddComment }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleClear = () => {
    setName('');
    setEmail('');
    setBody('');
    setNameError(false);
    setEmailError(false);
    setBodyError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = name.trim() !== '';
    const isEmailValid = email.trim() !== '';
    const isBodyValid = body.trim() !== '';

    setNameError(!isNameValid);
    setEmailError(!isEmailValid);
    setBodyError(!isBodyValid);

    if (!isNameValid || !isEmailValid || !isBodyValid) {
      return;
    }

    setSubmitting(true);

    try {
      await onAddComment({
        postId,
        name: name.trim(),
        email: email.trim(),
        body: body.trim(),
      });

      // ✅ Зберігаємо name та email, очищаємо ТІЛЬКИ body та скидаємо помилки
      setBody('');
      setBodyError(false);
      setNameError(false);
      setEmailError(false);
    } catch (error) {
      // ❌ При помилці не очищаємо поля, щоб користувач міг повторити спробу
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-cy="NewCommentForm">
      <div className="field">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>
        <div className="control">
          <input
            id="comment-author-name"
            type="text"
            name="name"
            className={`input ${nameError ? 'is-danger' : ''}`}
            placeholder="Name"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setNameError(false);
            }}
            data-cy="CommentNameInput"
          />
        </div>
        {nameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>
        <div className="control">
          <input
            id="comment-author-email"
            type="email"
            name="email"
            className={`input ${emailError ? 'is-danger' : ''}`}
            placeholder="Email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            data-cy="CommentEmailInput"
          />
        </div>
        {emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field">
        <label className="label" htmlFor="comment-body">
          Write a comment
        </label>
        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            className={`textarea ${bodyError ? 'is-danger' : ''}`}
            placeholder="Comment"
            value={body}
            onChange={e => {
              setBody(e.target.value);
              setBodyError(false);
            }}
            data-cy="CommentBodyInput"
          />
        </div>
        {bodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Comment body is required
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={`button is-link ${submitting ? 'is-loading' : ''}`}
            disabled={submitting}
            data-cy="SubmitCommentButton"
          >
            Add
          </button>
        </div>
        <div className="control">
          <button
            type="button"
            className="button is-link is-light"
            onClick={handleClear}
            disabled={submitting}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};

NewCommentForm.propTypes = {
  postId: PropTypes.number.isRequired,
  onAddComment: PropTypes.func.isRequired,
};
