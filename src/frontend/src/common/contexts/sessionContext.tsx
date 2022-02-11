import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import request from '../../apiClient';

interface User {
  username: string,
  id: string,
}

interface UserForm {
  username: string,
  passowrd: string,
}

interface ISessionContext {
  user: User | null,
  login: (userForm: UserForm) => Promise<void>
}

const SessionContext = createContext<ISessionContext>({
  user: null,
  login: () => { throw new Error('Context is uninitialized!'); },
});

const SessionProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    request('GET', 'auth/user').then((res) => {
      if (res.code < 300) setUser(res.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (userForm) => {
    const { code, data: returnedUser } = await request('POST', 'auth/login', userForm);

    if (code < 300) {
      setUser(returnedUser);
      return;
    }

    throw new Error(returnedUser.error);
  }, []);

  const value = useMemo(() => ({ user, login }), [user, login]);

  if (isLoading) return null;

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

const useSessionContext = () => useContext(SessionContext);

export { useSessionContext, SessionProvider };
