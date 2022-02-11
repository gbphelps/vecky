import { useCallback } from 'react';
import request, { IArgs } from './index';
import { useSessionContext } from '../common/contexts/sessionContext';

function useApiClient() {
  const { logout } = useSessionContext();

  const wrappedRequest = useCallback((...args: IArgs) => request(...args)
    .catch(async (err) => {
      if (err.code === 403) logout();
      throw (err);
    }), [logout]);

  return wrappedRequest;
}

export default useApiClient;
