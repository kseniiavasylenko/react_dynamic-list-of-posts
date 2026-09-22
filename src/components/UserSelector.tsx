import React, { useContext } from 'react';
import { User } from '../types/User';
import { UserContext } from './UserContext';
import { Loader } from './Loader';

interface Props {
  currentUser: User | null;
  onSelectUser: (user: User | null) => void;
}

export const UserSelector: React.FC<Props> = ({
  currentUser,
  onSelectUser,
}) => {
  const { users, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <select
          data-cy="UserSelector"
          className="select"
          value={currentUser?.id || ''}
          onChange={e => {
            const selectedId = Number(e.target.value);
            const selected = users.find(u => u.id === selectedId) || null;

            onSelectUser(selected);
          }}
        >
          <option value="" disabled>
            Choose a user
          </option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
