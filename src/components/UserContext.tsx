import React, { useEffect, useState } from 'react';
import { User } from '../types/User';
import { getUsers } from '../services/users.service';

export const UserContext = React.createContext<{
  users: User[];
  isLoading: boolean;
  error: boolean;
}>({
  users: [],
  isLoading: false,
  error: false,
});

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUsers()
      .then(setUsers)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ users, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};
