// src/components/UserContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { User } from '../types/User';
import { getUsers } from '../services/users.service'; // перевірте шлях до вашого API

interface UserContextType {
  users: User[];
  isLoading: boolean;
  hasError: boolean;
}

export const UserContext = createContext<UserContextType>({
  users: [],
  isLoading: false,
  hasError: false,
});

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setHasError(false);

    getUsers()
      .then(data => {
        if (isMounted) {
          setUsers(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ users, isLoading, hasError }}>
      {children}
    </UserContext.Provider>
  );
};
