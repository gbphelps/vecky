import AuthComponent from './authComponent';
import { useSessionContext } from '../../common/contexts/sessionContext';

function Login() {
  const { login } = useSessionContext();
  return <AuthComponent title="Sign in" onSubmit={login} />;
}

export default Login;
