import { useState, useCallback } from 'react';
import request from '../../apiClient';

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const onChange = useCallback(({ target: { value, name } }) => {
    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  }, []);

  const submitForm = useCallback(() => {
    request('POST', 'auth/login', form);
  }, [form]);

  return (
    <div>
      <input
        type="text"
        value={form.username}
        onChange={onChange}
        name="username"
      />
      <input
        type="password"
        value={form.password}
        onChange={onChange}
        name="password"
      />
      <button type="button" onClick={submitForm}>
        Submit
      </button>
    </div>
  );
}

export default Login;
