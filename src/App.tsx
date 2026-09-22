import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { Post } from './types/Post';
import { User } from './types/User';
import { getPosts } from './services/post.service';
import { UserContext } from './components/UserContext';

export const App = () => {
  const { users } = React.useContext(UserContext);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setCurrentPost(null);

    if (!currentUser) {
      setPosts([]);
      setIsLoading(false);
      setError(false);

      return;
    }

    setIsLoading(true);
    setError(false);

    getPosts(currentUser.id)
      .then(data => {
        setPosts(data);
      })
      .catch(() => {
        setError(true);
        setPosts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  currentUser={currentUser}
                  onSelectUser={setCurrentUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!currentUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {currentUser && isLoading && <Loader />}

                {currentUser && !isLoading && error && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {currentUser && !isLoading && !error && posts.length === 0 && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {currentUser && !isLoading && !error && posts.length > 0 && (
                  <PostsList
                    posts={posts}
                    currentPost={currentPost}
                    onPostSelect={setCurrentPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': currentPost !== null,
              },
            )}
          >
            {currentPost !== null && (
              <div className="tile is-child box is-success">
                <PostDetails post={currentPost} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
