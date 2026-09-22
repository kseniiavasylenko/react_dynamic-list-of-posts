import React, { useContext } from 'react';
import { User } from '../types/User';
import { UserContext } from './UserContext';

interface Props {
  currentUser: User | null;
  onSelectUser: (user: User | null) => void;
}

export const UserSelector: React.FC<Props> = ({
  currentUser,
  onSelectUser,
}) => {
  const { users } = useContext(UserContext);

  return (
    <div className="select is-fullwidth">
      <select
        value={currentUser?.id || ''}
        onChange={e => {
          const selectedId = Number(e.target.value);
          const selectedUser = users.find(u => u.id === selectedId) || null;

          onSelectUser(selectedUser);
        }}
        data-cy="UserSelector"
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
  );
};
