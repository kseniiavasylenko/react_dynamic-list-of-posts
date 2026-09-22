import React, { useState } from 'react';
import { CommentData } from '../types/Comment';

interface Props {
  postId: number;
  onAddComment: (comment: CommentData) => Promise<void>;
}

export const NewCommentForm: React.FC<Props> = ({ postId, onAddComment }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Ошибки валидации полей
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [bodyError, setBodyError] = useState(false);

  // Очистка формы и сброс ошибок
  const handleClear = () => {
    setName('');
    setEmail('');
    setBody('');
    setNameError(false);
    setEmailError(false);
    setBodyError(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Валидация полей
    const isNameValid = name.trim().length > 0;
    const isEmailValid = email.trim().length > 0 && email.includes('@');
    const isBodyValid = body.trim().length > 0;

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

      // Очищаем форму после успешного добавления
      handleClear();
    } catch (error) {
      // Ошибка обработки отправки при необходимости
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
            type="text"
            id="comment-author-name"
            name="name"
            className={`input ${nameError ? 'is-danger' : ''}`}
            placeholder="Name"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setNameError(false);
            }}
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
            type="email"
            id="comment-author-email"
            name="email"
            className={`input ${emailError ? 'is-danger' : ''}`}
            placeholder="Email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
          />
        </div>
        {emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required and must be valid
          </p>
        )}
      </div>

      <div className="field">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>
        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            className={`textarea ${bodyError ? 'is-danger' : ''}`}
            placeholder="Type your comment here..."
            value={body}
            onChange={e => {
              setBody(e.target.value);
              setBodyError(false);
            }}
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
          >
            Add
          </button>
        </div>
        <div className="control">
          {/* ОБРАТИТЕ ВНИМАНИЕ: type="button" предотвращает отправку формы при очистке */}
          <button
            type="button"
            className="button is-link is-light"
            onClick={handleClear}
            disabled={submitting}
            data-cy="ClearButton"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
