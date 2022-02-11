import { useState, useCallback } from 'react';
import styles from './index.module.scss';
import { useSessionContext } from '../../common/contexts/sessionContext';
// import StyleGuide from '../_styleGuide';

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const { login } = useSessionContext();

  const onChange = useCallback(({ target: { value, name } }) => {
    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  }, []);

  const submitForm = useCallback(async () => {
    login(form);
  }, [form, login]);

  return (
    <div className={styles['page-container']}>
      <div className={styles.container}>
        <h4>Sign in</h4>
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
    </div>
  );
}

export default Login;
