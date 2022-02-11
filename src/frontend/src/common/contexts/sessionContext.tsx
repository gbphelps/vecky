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
  login: (userForm: UserForm) => Promise<void>,
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
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    request('GET', 'auth/user').then((res) => {
      setUser(res.data);
    }).catch(logout);
  }, [logout]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

const useSessionContext = () => useContext(SessionContext);

export { useSessionContext, SessionProvider };
