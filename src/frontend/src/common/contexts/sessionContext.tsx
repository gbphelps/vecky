import React, {
  createContext, useContext, useState, useEffect,
} from 'react';
import request from '../../apiClient';

const SessionContext = createContext({});

const SessionProvider: React.FunctionComponent<{}> = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    request('GET', 'auth/user').then((res) => {
      if (res.code < 300) setUser(res.data);
    });
  }, []);

  return <SessionContext.Provider value={{ user }}>{children}</SessionContext.Provider>;
};

const useSessionContext = () => useContext(SessionContext);

export { useSessionContext, SessionProvider };
