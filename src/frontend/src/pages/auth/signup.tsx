import AuthComponent from './authComponent';
import useApiClient from '../../apiClient/useApiClient';

function Signup() {
  const request = useApiClient();
  return (
    <AuthComponent
      title="Sign up"
      onSubmit={async (form) => {
        await request('POST', 'user', form);
      }}
    />
  );
}

export default Signup;
