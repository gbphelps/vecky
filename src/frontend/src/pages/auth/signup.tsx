import { useNavigate } from 'react-router-dom';
import AuthComponent from './authComponent';
import useApiClient from '../../apiClient/useApiClient';

function Signup() {
  const request = useApiClient();
  const navigate = useNavigate();
  return (
    <AuthComponent
      title="Sign up"
      onSubmit={async (form) => {
        try {
          await request('POST', 'users', form);
          navigate('/login');
        } catch (err) {
          console.log(err);
        }
      }}
    />
  );
}

export default Signup;
