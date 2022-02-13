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

type TUserForm = {
  username: string,
  password: string,
}

interface ISessionContext {
  user: User | null,
  login: (userForm: TUserForm) => Promise<void>,
  logout: () => Promise<void>,
}

async function uninitialized() {
  throw new Error('Context is uninitialized!');
}

const SessionContext = createContext<ISessionContext>({
  user: null,
  login: uninitialized,
  logout: uninitialized,
});

const SessionProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User | null>(__user__);

  const login = useCallback(async (userForm) => {
    try {
      const { data: returnedUser } = await request('POST', 'auth/login', userForm);
      setUser(returnedUser);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const logout = useCallback(async () => {
    await request('POST', 'auth/logout').finally(() => {
      setUser(null);
    });
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

const useSessionContext = () => useContext(SessionContext);

export { useSessionContext, SessionProvider };
export type { TUserForm };
