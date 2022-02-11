import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import request from '../../apiClient';
import LoadingComponent from '../components/loadingComponent';

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

class LocalStorageValue<T> {
  ls: Storage;

  key: string;

  constructor(key: string) {
    this.key = key;
    this.ls = localStorage;
  }

  get(): T | null {
    const str = this.ls.getItem(this.key);
    if (!str) return null;
    return JSON.parse(str);
  }

  set(value: T) {
    this.ls.setItem(this.key, JSON.stringify(value));
  }

  unset() {
    this.ls.removeItem(this.key);
  }
}

const SessionProvider: React.FunctionComponent = ({ children }) => {
  const storedUser = useMemo(() => new LocalStorageValue<User>('user'), []);

  const [user, setUser] = useState(storedUser.get());
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (userForm) => {
    try {
      const { data: returnedUser } = await request('POST', 'auth/login', userForm);
      setUser(returnedUser);
      storedUser.set(returnedUser);
    } catch (err) {
      console.log(err);
    }
  }, [storedUser]);

  const logout = useCallback(async () => {
    await request('POST', 'auth/logout').finally(() => {
      setUser(null);
      storedUser.unset();
    });
  }, [storedUser]);

  useEffect(() => {
    request('GET', 'auth/user').then((res) => {
      setUser(res.data);
    }).catch(logout).finally(() => {
      setIsLoading(false);
    });
  }, [storedUser, logout]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

const useSessionContext = () => useContext(SessionContext);

export { useSessionContext, SessionProvider };
